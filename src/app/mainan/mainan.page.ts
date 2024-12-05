import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainan',
  templateUrl: './mainan.page.html',
  styleUrls: ['./mainan.page.scss'],
})
export class MainanPage implements OnInit {
  dataMainan: any;
  modalTambah: any;
  id: any;
  mainan: any;
  cerita: any;

  constructor(private api: ApiService, private modal: ModalController, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.getMainan();
  }

  getMainan() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataMainan = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  

resetModal() {
  this.id = null;
  this.mainan = '';
  this.cerita = '';
}

openModalTambah(isOpen: boolean) {
  this.modalTambah = isOpen;
  this.resetModal();
  this.modalTambah = true;
  this.modalEdit = false;
}

cancel() {
  this.modal.dismiss();
  this.modalTambah = false;
  this.modalEdit = false;
  this.resetModal();
}

tambahMainan() {
  if (this.mainan != '' && this.cerita != '') {
    let data = {
      mainan: this.mainan,
      cerita: this.cerita,
    }
    this.api.tambah(data, 'tambah.php')
      .subscribe({
        next: (hasil: any) => {
          this.resetModal();
          console.log('berhasil tambah mainan');
          this.getMainan();
          this.modalTambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah mainan');
        }
      })
  } else {
    console.log('gagal tambah mainan karena masih ada data yg kosong');
  }
}

hapusMainan(id: any) {
  this.api.hapus(id,
    'hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getMainan();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      }
    })
}

ambilMainan(id: any) {
  this.api.lihat(id,
    'lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let mainan = hasil;
        this.id = mainan.id;
        this.mainan = mainan.mainan;
        this.cerita = mainan.cerita;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      }
    })
}

modalEdit: any;

openModalEdit(isOpen: boolean, idget: any) {
  this.modalEdit = isOpen;
  this.id = idget;
  console.log(this.id);
  this.ambilMainan(this.id);
  this.modalTambah = false;
  this.modalEdit = true;
}

editMainan() {
  let data = {
    id: this.id,
    mainan: this.mainan,
    cerita: this.cerita
  }
  this.api.edit(data, 'edit.php')
    .subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.resetModal();
        this.getMainan();
        console.log('berhasil edit Mainan');
        this.modalEdit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Mainan');
      }
    })
}

logout() {
  this.authService.logout();
  this.router.navigateByUrl('/login');
}
}