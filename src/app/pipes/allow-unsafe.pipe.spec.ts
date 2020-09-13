import { async, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { AllowUnsafePipe } from './allow-unsafe.pipe';

describe('AllowUnsafePipe', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowUnsafePipe ],
      providers: [ 
        AllowUnsafePipe,
        { 
          provide: DomSanitizer, 
          useValue: { bypassSecurityTrustUrl() { } }
        }
      ]
    });
  }));

  it('create an instance', () => {

    const pipe = TestBed.inject(AllowUnsafePipe);
    expect(pipe).toBeTruthy();

  });

  it('calls the dom sanitizer', () => {

    const testValue = 'test value';
    const domSanitizer = TestBed.inject(DomSanitizer);
    const spy = spyOn(domSanitizer, 'bypassSecurityTrustUrl').and.returnValue(testValue);

    const pipe = TestBed.inject(AllowUnsafePipe);
    const result = pipe.transform(testValue);
    expect(domSanitizer.bypassSecurityTrustUrl).toHaveBeenCalled();
    expect(result).toBe(testValue);

  });

});
