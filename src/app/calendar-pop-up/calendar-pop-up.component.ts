import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-pop-up',
  templateUrl: './calendar-pop-up.component.html',
  styleUrls: ['./calendar-pop-up.component.css'],
})
export class CalendarPopUpComponent {
  today: Date = new Date();
  currentMonth: number = this.today.getMonth();
  currentYear: number = this.today.getFullYear();
  daysInMonth: number[] = [];
  firstDay: number = 0;
  selectedDate: Date | null = null;

  constructor(public dialogRef: MatDialogRef<CalendarPopUpComponent>) {}

  ngOnInit() {
    this.generateCalendar(this.currentMonth, this.currentYear);
  }
  getNextMonday(): Date {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday;
  }
  
  getNextTuesday(): Date {
    const today = new Date();
    const daysUntilTuesday = (9 - today.getDay()) % 7 || 7;
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    return nextTuesday;
  }
  
  getAfterOneWeek(): Date {
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    return oneWeekLater;
  }
  
 
  generateCalendar(month: number, year: number): void {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    this.firstDay = firstDay;
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectDate(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
  }

  selectToday(): void {
    this.selectedDate = new Date();
    this.currentMonth = this.selectedDate.getMonth();
    this.currentYear = this.selectedDate.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectNextMonday(): void {
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    this.selectedDate = nextMonday;
    this.currentMonth = nextMonday.getMonth();
    this.currentYear = nextMonday.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectNextTuesday(): void {
    const today = new Date();
    const daysUntilTuesday = (9 - today.getDay()) % 7 || 7;
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + daysUntilTuesday);
    this.selectedDate = nextTuesday;
    this.currentMonth = nextTuesday.getMonth();
    this.currentYear = nextTuesday.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  selectAfterOneWeek(): void {
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    this.selectedDate = oneWeekLater;
    this.currentMonth = oneWeekLater.getMonth();
    this.currentYear = oneWeekLater.getFullYear();
    this.generateCalendar(this.currentMonth, this.currentYear);
  }

  closeCalender=()=>{
    this.dialogRef.close();
  }
  saveDate=()=>{
    this.dialogRef.close(this.selectedDate)
  }
}
