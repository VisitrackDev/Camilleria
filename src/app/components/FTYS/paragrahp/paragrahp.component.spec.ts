import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParagrahpComponent } from './paragrahp.component';

describe('ParagrahpComponent', () => {
  let component: ParagrahpComponent;
  let fixture: ComponentFixture<ParagrahpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParagrahpComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParagrahpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
