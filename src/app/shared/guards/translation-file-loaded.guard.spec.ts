import { TestBed, async, inject } from '@angular/core/testing';

import { TranslationFileLoadedGuard } from './translation-file-loaded.guard';

describe('TranslationFileLoadedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslationFileLoadedGuard]
    });
  });

  it('should ...', inject([TranslationFileLoadedGuard], (guard: TranslationFileLoadedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
