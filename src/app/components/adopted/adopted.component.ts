import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-adopted',
  imports: [CommonModule],
  templateUrl: './adopted.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('700ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AdoptedComponent implements OnInit {
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
        const adoptedIds = this.petService.getAdopted(this.userId);
        const filtered = all.filter((pet: any) => adoptedIds.includes(pet.id.toString()));
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

  prevPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.loadPets();
    }
  }

  currentPage(): number {
    return this.page();
  }

  removeFromAdopted(petId: number): void {
    this.petService.removeAdopted(this.userId, petId);
    this.loadPets();
  }
}
