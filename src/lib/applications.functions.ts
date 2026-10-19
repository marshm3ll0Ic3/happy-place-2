import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const schema = z.object({ alias:z.string().max(60), country:z.string().max(80), work_sample_url:z.string().max(500), milestone:z.string().max(2000), constraints:z.string().max(2000), adult_confirmed:z.boolean(), public_consent:z.boolean(), evidence_consent:z.boolean(), commercial_consent:z.boolean(), submit:z.boolean(), budget:z.record(z.enum(["rent","utilities","software","connectivity","contingency"]),z.number().int().min(0).max(1000000)) });
export const getApplication = createServerFn({method:"GET"}).middleware([requireSupabaseAuth]).handler(async({context})=>{
  const {data,error}=await context.supabase.from("talent_applications").select("*").eq("user_id",context.userId).maybeSingle();
  if(error) throw new Error("Unable to load application");
  return data;
});
export const saveApplication = createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator(input=>schema.parse(input)).handler(async({data,context})=>{
  const {submit,...fields}=data;
  if(fields.work_sample_url && !/^https:\/\//.test(fields.work_sample_url)) throw new Error("Use an HTTPS work sample link");
  const {data:existing,error:readError}=await context.supabase.from("talent_applications").select("id,status").eq("user_id",context.userId).maybeSingle();
  if(readError) throw new Error("Unable to load application");
  if(existing && !["draft","more_information"].includes(existing.status)) throw new Error("Submitted applications cannot be edited");
  let id=existing?.id;
  if(!id){const {data:created,error}=await context.supabase.from("talent_applications").insert({user_id:context.userId,...fields,status:"draft"}).select("id").single(); if(error||!created) throw new Error("Unable to create draft");id=created.id;}
  const {data:saved,error}=await context.supabase.from("talent_applications").update({...fields,status:submit?"submitted":"draft"}).eq("id",id).eq("user_id",context.userId).select("id,status").single();
  if(error||!saved)throw new Error("Complete eligibility, consent and required application fields");
  return saved;
});