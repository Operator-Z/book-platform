import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookClubs } from './book-clubs';

describe('BookClubs', () => {
  let component: BookClubs;
  let fixture: ComponentFixture<BookClubs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookClubs],
    }).compileComponents();

    fixture = TestBed.createComponent(BookClubs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
