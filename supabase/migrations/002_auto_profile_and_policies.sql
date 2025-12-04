-- 自動プロフィール作成トリガー
-- auth.usersに新規ユーザーが作成されたときに自動的にprofilesを作成

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.usersへのトリガー設定
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 追加のDELETEポリシー

-- Profiles: ユーザーが自分のプロフィールを削除可能
CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Swipes: ユーザーが自分のスワイプを削除可能（スワイプ取り消し用）
CREATE POLICY "Users can delete their own swipes"
  ON swipes FOR DELETE
  USING (auth.uid() = swiper_id);

-- Matches: マッチング解除（どちらかのユーザーが削除可能）
CREATE POLICY "Users can delete their own matches"
  ON matches FOR DELETE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
