// Fungsi untuk memperbarui jam dan tanggal
        // Array nama hari dalam bahasa Indonesia
        const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        
        // Array nama bulan dalam bahasa Indonesia
        const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        function updateClock() {
            // Ambil waktu saat ini
            const now = new Date();
            
            // Format jam (HH:MM:SS)
            let jam = String(now.getHours()).padStart(2, '0');
            let menit = String(now.getMinutes()).padStart(2, '0');
            let detik = String(now.getSeconds()).padStart(2, '0');
            
            const timeString = `${jam}:${menit}:${detik}`;
            
            // Update tampilan jam
            document.getElementById('clock').textContent = timeString;
            
            // Format tanggal
            const namaHari = hari[now.getDay()];
            const tanggal = now.getDate();
            const namaBulan = bulan[now.getMonth()];
            const tahun = now.getFullYear();
            
            const dateString = `${tanggal} ${namaBulan} ${tahun}`;
            
            // Update tampilan hari dan tanggal
            document.getElementById('dayName').textContent = namaHari;
            document.getElementById('dateInfo').textContent = dateString;
        }

        // Update jam pertama kali
        updateClock();
        
        // Update jam setiap 1000 milidetik (1 detik)
        setInterval(updateClock, 1000);