import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AddressService } from '../services/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  file: File;
  userForm: FormGroup;
  provinces = [];
  districts = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.prepareUserForm();
    this.fetchProvince();
  }

  /**
   * initialize user form
   */
  prepareUserForm(){
    this.userForm = this.fb.group({
      image: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z\\s]+$')]],
      email: ['', Validators.required],
      password: ['', Validators.required],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      addressId: ['', Validators.required],
      province: ['', Validators.required],
      role: ['', Validators.required]
    })
  }

  get form(){ return this.userForm.controls; }

  /**
   * create user
   */
  register(){
    if(this.userForm.invalid){
      return;
    }
    const formData: FormData = this.prepareFormData();
    this.userService.createUser(formData).subscribe(response => {
      if(response.status){
        Swal.fire('Success', response.message, 'success');
        this.router.navigate(['/']);
      }else{
        Swal.fire('Sorry', response.message, 'error');
      }
    }, (error) => {
      Swal.fire('Sorry', error.error.message, 'error');
    });
  }

  /**
   * handle file event
   */
  handleFile(event: any){
    const fileList: FileList = event.target.files;
    if(fileList.length > 0){
      this.file = fileList[0];
      this.userForm.controls['image'].setValue(this.file.name);
    }
  }

  /**
   *prepare FormData
   */
  prepareFormData() {
    const formData = new FormData();
    if(this.file){
      formData.append('image', this.file, this.file.name);
    }
    formData.append('firstName', this.userForm.value.firstName);
    formData.append('lastName', this.userForm.value.firstName);
    formData.append('role', this.userForm.value.role);
    formData.append('email', this.userForm.value.email);
    formData.append('gender', this.userForm.value.gender);
    formData.append('password', this.userForm.value.password);
    formData.append('addressId', this.userForm.value.addressId);
    formData.append('mobile', this.userForm.value.mobile);
    formData.append('dob', this.userForm.value.dob);
    formData.append('bloodGroup', this.userForm.value.bloodGroup);
    return formData;
  }

  fetchProvince() {
    this.addressService.getProvinces().subscribe(response => {
      this.provinces = response.data;
      this.fetchDistricts(this.provinces[0]);
    })
  }

  fetchDistricts(province) {
    this.addressService.getProvinceWiseDistricts(province).subscribe(response => {
      this.districts = response.data;
    })
  }

}
