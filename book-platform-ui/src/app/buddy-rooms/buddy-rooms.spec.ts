import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuddyRooms } from './buddy-rooms';

describe('BuddyRooms', () => {
  let component: BuddyRooms;
  let fixture: ComponentFixture<BuddyRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuddyRooms],
    }).compileComponents();

    fixture = TestBed.createComponent(BuddyRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
