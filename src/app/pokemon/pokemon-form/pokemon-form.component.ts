import { Component, Input, OnInit } from "@angular/core";
import { PokemonService } from "../pokemon.service";
import { Pokemon } from "../pokemon";
import { Router } from "@angular/router";

// Décorateur de composant qui fournit les métadonnées pour le composant.
@Component({
  selector: "app-pokemon-form",
  templateUrl: "./pokemon-form.component.html",
  styleUrls: ["./pokemon-form.component.css"],
})
export class PokemonFormComponent implements OnInit {
  // Propriété d'entrée pour recevoir un objet Pokemon depuis le composant parent.
  @Input() pokemon: Pokemon;
  types: string[];
  isAddForm: boolean;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit() {
    this.types = this.pokemonService.getPokemonTypeList();
    //Je verifie si j'ai add dans l'url qui veut dire que je suis dans le cas d'un ajout de pokemon
    this.isAddForm = this.router.url.includes("add");
  }

  // Méthode pour vérifier si le type fourni existe dans la liste des types du Pokemon.
  hasType(type: string): boolean {
    return this.pokemon.types.includes(type);
  }

  // Méthode appelée lorsque le type est sélectionné ou désélectionné dans le formulaire.
  selectType($event: Event, type: string) {
    const isChecked: boolean = ($event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Si le type est sélectionné, l'ajouter au tableau des types du Pokemon.
      this.pokemon.types.push(type);
    } else {
      // Si le type est désélectionné, le supprimer du tableau des types du Pokemon.
      const index = this.pokemon.types.indexOf(type);
      this.pokemon.types.splice(index, 1);
    }
  }

  // Méthode pour vérifier si l'ajout ou la suppression du type fourni maintiendrait les types valides.
  isTypesValid(type: string): boolean {
    if (this.pokemon.types.length === 1 && this.hasType(type)) {
      return false; // Empêcher la suppression du dernier type s'il n'y a qu'un seul type sélectionné.
    }
    if (this.pokemon.types.length > 2 && !this.hasType(type)) {
      return false; // Empêcher l'ajout de plus de deux types.
    }
    return true; // Le type peut être ajouté ou supprimé sans violer les règles.
  }

  // Méthode appelée lorsque le formulaire est soumis.
  onSubmit() {
    //Dans le cas d'un ajout
    if (this.isAddForm) {
      this.pokemonService
        .addPokemon(this.pokemon)
        .subscribe((pokemon: Pokemon) => {
          this.router.navigate(["/pokemon", pokemon.id]);
        });
    } else {
      // Appeler le PokemonService pour mettre à jour les détails du Pokemon.
      this.pokemonService.updatePokemon(this.pokemon).subscribe(() => {
        // Après la mise à jour réussie, naviguer vers la page des détails du Pokemon.
        this.router.navigate(["/pokemon", this.pokemon.id]);
      });
    }
  }
}
