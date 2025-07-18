// src/app/components/pets/pets.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pets.component.html',
  animations: [
    trigger('listStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'scale(0.9)' }),
            stagger(200, [
              animate('800ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class PetsComponent implements OnInit {
  pets: any[] = [];
  loading = false;
  error = false;
  userId = 'user_123';

  currentPage = signal(1);
  favorites = signal<string[]>(this.petService.getFavorites(this.userId));
  adopted = signal<string[]>(this.petService.getAdopted(this.userId));

  searchText: string = '';

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.fetchPets();
  }

  fetchPets(): void {
    this.loading = true;
    this.error = false;

    this.petService.getPets({ page: this.currentPage() }).subscribe({
      next: (res) => {
        this.pets = res.animals || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching pets:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  filteredPets(): any[] {
    return this.pets.filter(pet =>
      pet.name?.toLowerCase().startsWith(this.searchText.toLowerCase())
    );
  }

  nextPage(): void {
    this.currentPage.set(this.currentPage() + 1);
    this.fetchPets();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.fetchPets();
    }
  }

  toggleFavorite(petId: number): void {
    this.petService.toggleFavorite(this.userId, petId);
    const current = this.favorites();
    const id = petId.toString();
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];
    this.favorites.set(updated);
  }

  toggleAdopt(petId: number): void {
    if (!this.isAdopted(petId)) {
      this.petService.adoptPet(this.userId, petId);
      const updated = [...this.adopted(), petId.toString()];
      this.adopted.set(updated);
    }
  }

  isFavorite(petId: number): boolean {
    return this.favorites().includes(petId.toString());
  }

  isAdopted(petId: number): boolean {
    return this.adopted().includes(petId.toString());
  }
}
