# Folder model

Model YOLO tim dibagikan lewat flashdisk, bukan GitHub. Ada tiga model terpisah dalam format OpenVINO.
Salin setiap folder ke sini sehingga susunannya seperti berikut:

```
vision/models/
├── kotak/              # kelas: blue_box, green_box  (kotak misi imaging)
│   ├── best.xml
│   ├── best.bin
│   └── metadata.yaml
├── bola_merah_hijau/   # kelas: bola_hijau, bola_merah  (lintasan navigasi)
│   ├── best.xml
│   ├── best.bin
│   └── metadata.yaml
└── bola_biru/          # kelas: blue_buoy  (docking)
    ├── best.xml
    ├── best.bin
    └── metadata.yaml
```

`best.xml` dan `best.bin` selalu berpasangan. Tanpa `best.bin`, model tidak bisa dimuat.
