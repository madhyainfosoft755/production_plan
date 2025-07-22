import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() { }

  public translatePage(): void {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
    window['googleTranslateElementInit'] = () => {
      new window['google'].translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
      this.filterLanguages(); // To get only filtered languages in the dropdown
      this.addDropdownListener(); // On changing languages, it still ensure to display only allowed languages in the dropdown, not all languages
    };
  }


  private filterLanguages(): void {
    const allowedLanguages = ['en', 'hi']; // English, Hindi, Tamil
    setTimeout(() => {
      const selectElement = document.querySelector('#google_translate_element select') as HTMLSelectElement ;
      if (selectElement) {
        for (let i = 0; i < selectElement.options.length; i++) {
          const option = selectElement.options[i];
          if (!allowedLanguages.includes(option.value)) {
            option.style.display = 'none';
          }
        }
      }
    }, 1000); // Delay to ensure the dropdown is fully rendered
  }

  private addDropdownListener(): void {
    const allowedLanguages = ['en', 'hi']; // English, Hindi, Tamil
    setTimeout(() => {
      const selectElement = document.querySelector('#google_translate_element select') as HTMLSelectElement;
      if (selectElement) {
        selectElement.addEventListener('click', () => {
          setTimeout(() => {
            for (let i = 0; i < selectElement.options.length; i++) {
              const option = selectElement.options[i];
              if (!allowedLanguages.includes(option.value)) {
                option.style.display = 'none';
              }
            }
          }, 500); // Delay to ensure the dropdown is fully rendered
        });
      }
    }, 1000); // Delay to ensure the dropdown is fully rendered
  }

}
