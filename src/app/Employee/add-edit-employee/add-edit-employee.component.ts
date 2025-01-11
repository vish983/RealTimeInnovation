import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarPopUpComponent } from 'src/app/calendar-pop-up/calendar-pop-up.component';
import { IndexDBService } from 'src/index-db.service';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css'],
})
export class AddEditEmployeeComponent implements OnInit {
  userId: any;
  userForm!: FormGroup;
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private indexDbService: IndexDBService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.userId = this.activatedRoute.snapshot.params['id'];
      setTimeout(() => {
        this.getUserData(this.userId);
      }, 300);

      //api call
    }

    this.userForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
    });
  }

  getUserData = (userId: number) => {
    this.indexDbService
      .getData(userId)
      .then((res) => {
        console.log(res);
        this.patchFormData(res);

        // this.getAllEmployees(); // Refresh employee list after saving
      })
      .catch((error) => {
        console.error('Error saving employee:', error);
      });
  };

  roles = [
    'Flutter Developer',
    'Product Designer',
    'QA Tester',
    'Product Owner',
  ];

  patchFormData = (responseData: any) => {
    this.userForm.patchValue({
      id: parseInt(this.userId),
      name: responseData.name,
      designation: responseData.designation,
      startDate: responseData.startDate,
      endDate: responseData.endDate,
    });
  };

  save = () => {
    if (!this.userId) {
      this.userForm.removeControl('id');
    }
    this.indexDbService
      .saveData(this.userForm.value)
      .then(() => {
        if (this.userId) {
          this.snackBar.open('Emplyeee Updated successfully!', 'ok',{duration:3000});
        } else {
          this.snackBar.open('Emplyeee created successfully!', 'ok',{duration:3000});
          this.userForm.reset();
        }
       
        // this.getAllEmployees(); // Refresh employee list after saving
      })
      .catch((error) => {
        console.error('Error saving employee:', error);
      });
  };

  deleteEmployee(id: number): void {
    this.indexDbService
      .deleteData(id)
      .then(() => {
        this.snackBar.open('Employee deleted successfully!', 'ok',{duration:3000});
        setTimeout(() => {
          this.router.navigate(['employeelist']);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  }

  openCalendar(field: 'startDate' | 'endDate') {
    const dialogRef = this.dialog.open(CalendarPopUpComponent, {
      width: '354px',
    });

    dialogRef.afterClosed().subscribe((selectedDate) => {
      console.log(selectedDate);
      if (field == 'startDate') {
        this.userForm.patchValue({
          startDate: this.datePipe.transform(selectedDate, 'mediumDate'),
        });
      } else {
        this.userForm.patchValue({
          endDate: this.datePipe.transform(selectedDate, 'mediumDate'),
        });
      }
    });
  }
}
