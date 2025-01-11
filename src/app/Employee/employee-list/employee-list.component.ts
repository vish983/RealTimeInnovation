import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IndexDBService } from 'src/index-db.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  empList: any[] = [];
  currentEmployees: any[] = [];
  previousEmployees: any[] = [];
  countdown: number = 10;
  timerId: any;
  constructor(private indexDbService: IndexDBService, private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.getAllEmployee();
    }, 200);
  }

  getAllEmployee = () => {
    this.indexDbService
      .getAllData()
      .then((data: any) => {
        if (data) {
          data.map((ele: any) => {
            if (ele.endDate) {
              this.previousEmployees.push(ele);
            } else {
              this.currentEmployees.push(ele);
            }
          });
        }
        console.log('Fetched data:', data);
      })
      .catch((error: any) => {
        console.error('Error:', error);
      });
  };

  undoVisible = false;
  private deletedEmployee: any = null;

  onSwipeLeft(employee: any) {
    employee.swiped = true;
  }

  onSwipeRight(employee: any) {
    employee.swiped = false;
  }

  redirectToEdit = (id: number) => {
    this.router.navigate(['/editemployee', id]);
  };

  deleteEmployee(employee: any) {
    this.deletedEmployee = employee;
    this.undoVisible = true;
    this.currentEmployees = this.currentEmployees.filter((e) => e !== employee);
    this.previousEmployees = this.previousEmployees.filter(
      (e) => e !== employee
    );
    
    this.timerId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timerId); // Stop the interval
      }
    }, 1000);

    setTimeout(() => {
      if(this.undoVisible){
        this.deleteEmployeeFromDataBase(employee.id)
         this.undoVisible = false
      }
    }, 10000);
  }


  deleteEmployeeFromDataBase(id: number): void {
    this.indexDbService
      .deleteData(id)
      .then(() => {
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
      });
  }

  undoDelete() {
    clearInterval(this.timerId);
    if (this.deletedEmployee) {
      if (this.deletedEmployee.endDate) {
        this.previousEmployees.push(this.deletedEmployee);
      } else {
        this.currentEmployees.push(this.deletedEmployee);
      }
      this.deletedEmployee = null;
      this.undoVisible = false;
    }
  }
}
