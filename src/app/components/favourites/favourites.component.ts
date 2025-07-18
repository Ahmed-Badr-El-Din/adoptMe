import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-favourites',
  imports: [CommonModule],
  templateUrl: './favourites.component.html',
   animations: [
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      animate('700ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ])
]

})
export class FavouritesComponent implements OnInit {
  pets = signal<any[]>([]);
  loading = signal(true);
  error = signal(false);

  page = signal(1);
  userId = 'user_123';

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading.set(true);
    this.error.set(false);

    this.petService.getPets({ page: this.page() }).subscribe({
      next: (res) => {
        const all = res.animals || [];
        const favIds = this.petService.getFavorites(this.userId);
        const filtered = all.filter((pet: any) => favIds.includes(pet.id.toString()));
        this.pets.set(filtered);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  nextPage(): void {
    this.page.set(this.page() + 1);
    this.loadPets();
  }

  removeFromFavorites(petId: number): void {
  this.petService.toggleFavorite(this.userId, petId);
  this.loadPets(); // عشان تحدث القائمة بعد الحذف
}

  prevPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.loadPets();
    }
  }

  currentPage(): number {
    return this.page();
  }
}
