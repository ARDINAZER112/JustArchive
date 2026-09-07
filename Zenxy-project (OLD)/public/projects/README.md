Taruh file screenshot project di folder ini, misalnya:

  novelku.png
  jadwal-ramadhan.png

Lalu di src/data.ts, isi field `image` pada project terkait:

  image: "/projects/novelku.png"

Kalau field `image` dikosongkan/dihapus, kartu project otomatis
kembali memakai mockup abstrak bawaan.
