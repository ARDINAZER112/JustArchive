-- 1. Membuat tabel 'novels'
CREATE TABLE novels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) NOT NULL,
    author_avatar TEXT
);

-- 2. Mengaktifkan fitur keamanan RLS (Wajib!)
ALTER TABLE novels ENABLE ROW LEVEL SECURITY;

-- 3. Policy: SIAPA SAJA BISA MEMBACA
-- Mengizinkan semua orang (termasuk yang tidak login) untuk melihat daftar novel
CREATE POLICY "Publik bisa membaca novel" 
ON novels FOR SELECT 
USING (true);

-- 4. Policy: HANYA USER LOGIN YANG BISA MENULIS
-- Mengizinkan user mengunggah novel HANYA JIKA author_id cocok dengan ID akun mereka
CREATE POLICY "Penulis bisa menerbitkan karyanya sendiri" 
ON novels FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- 5. Policy: HANYA BISA MENGEDIT MILIK SENDIRI
CREATE POLICY "Penulis bisa mengedit karyanya sendiri" 
ON novels FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 6. Policy: HANYA BISA MENGHAPUS MILIK SENDIRI
CREATE POLICY "Penulis bisa menghapus karyanya sendiri" 
ON novels FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);