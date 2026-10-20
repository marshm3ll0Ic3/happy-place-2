DROP POLICY IF EXISTS "own txns" ON public.transactions;
CREATE POLICY "own txns" ON public.transactions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.ledger_entries e WHERE e.transaction_id = transactions.id AND e.user_id = auth.uid()));
DROP TRIGGER IF EXISTS on_auth_user_signup_bonus ON auth.users;
CREATE TRIGGER on_auth_user_signup_bonus AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_signup_bonus();