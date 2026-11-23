import { Component, DestroyRef, forwardRef, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { Place } from '../../../core/models/place';
import { Places } from '../../../core/services/places';

// input with place suggestions, value is the selected Place or null
@Component({
  selector: 'app-place-autocomplete',
  templateUrl: './place-autocomplete.html',
  styleUrl: './place-autocomplete.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaceAutocomplete),
      multi: true,
    },
  ],
})
export class PlaceAutocomplete implements ControlValueAccessor, OnInit {
  inputId = input('destination');
  placeholder = input('Busca una ciudad, región o país');

  text = signal('');
  suggestions = signal<Place[]>([]);
  open = signal(false);
  activeIndex = signal(-1);
  searching = signal(false);
  disabled = signal(false);

  private search$ = new Subject<string>();
  private onChange: (value: Place | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private places: Places,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit() {
    // wait until the user stops typing
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((text) => {
          if (text.trim().length < 2) {
            return of([]);
          }
          this.searching.set(true);
          return this.places.search(text).pipe(catchError(() => of([])));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((places) => {
        this.searching.set(false);
        this.suggestions.set(places);
        this.activeIndex.set(-1);
        this.open.set(places.length > 0);
      });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.text.set(value);
    // typing again clears the selected place
    this.onChange(null);
    this.search$.next(value);
  }

  onKeydown(event: KeyboardEvent): void {
    const total = this.suggestions().length;
    if (!this.open() || total === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() + 1) % total);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.set((this.activeIndex() - 1 + total) % total);
    } else if (event.key === 'Enter' && this.activeIndex() >= 0) {
      event.preventDefault();
      this.select(this.suggestions()[this.activeIndex()]);
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  select(place: Place): void {
    this.text.set(place.name);
    this.open.set(false);
    this.onChange(place);
  }

  onBlur(): void {
    this.onTouched();
    // delay so the click on a suggestion is registered
    setTimeout(() => this.open.set(false), 150);
  }

  writeValue(place: Place | null): void {
    this.text.set(place?.name ?? '');
  }

  registerOnChange(fn: (value: Place | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
