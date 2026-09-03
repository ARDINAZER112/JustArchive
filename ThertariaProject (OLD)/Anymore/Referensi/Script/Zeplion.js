//Constructor Method
class Siswa{
    constructor(nama, usia){
        this.nama = nama;
        this.usia = usia;
    }
    sapa(){
        console.log("Halo, nama saya " + this.nama + " dan saya berusia " + this.usia + " tahun.");
    }
gantinama (ubahnama) {
    this.nama = ubahnama;
    }   
}
let Siswa1 = new Siswa("ARCHTEN", 16);
let Siswa2 = new Siswa("Nemesis", 17);
Siswa1.sapa();
Siswa2.sapa();
Siswa1.gantinama("ARCHERVER");
Siswa1.sapa();

//Static Method
class Matematika{
    static tambah(a, b){
        return a + b;
        
    }
}

let hasil = Matematika.tambah(2, 3);
console.log(hasil);

//Mobil
class Kendaraan{
    constructor(jenis, nama, warna){
        this.jenis = jenis;
        this.nama = nama;
        this.warna = warna;
    }
    info(){
        console.log("Mobil ini berjenis " + this.jenis + " bernama " + this.nama + " dan berwarna " + this.warna + ".");
    }
}
let Kendaraan1 = new Kendaraan("Mobil", "Avanza", "Merah");
let Kendaraan2 = new Kendaraan("Motor", "Ninja", "Hitam");
let Kendaraan3 = new Kendaraan("Truck", "Fuso", "Putih");
let Kendaraan4 = new Kendaraan("Bus", "Mercedes", "Biru");
Kendaraan1.info();
Kendaraan2.info();
Kendaraan3.info();
Kendaraan4.info();