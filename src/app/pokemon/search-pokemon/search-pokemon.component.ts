import { Component, OnInit } from "@angular/core";
import { Pokemon } from "../pokemon";
import { Router } from "@angular/router";
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { PokemonService } from "../pokemon.service";

@Component({
  selector: "app-search-pokemon",
  templateUrl: "./search-pokemon.component.html",
  styles: [],
})
export class SearchPokemonComponent implements OnInit {
  // Comme les observables sont juste consomable et nous on veut le piloter donc on est obliger d'utiliser les Subject de RXjs
  // Construre un flux de donnee dans le temps avec la recherche de l'utilisateur
  // Subject est une class particuliere qui permet de stocket les recherche successif de l'utilisateur

  //{..."a".."ab"..."abz".."ab"}
  searchTerms = new Subject<string>();
  //{..pokemonList(a)...pokemonList(ab)..}
  pokemons$: Observable<Pokemon[]>;

  constructor(private router: Router, private pokemonSrvice: PokemonService) {}

  ngOnInit() {
    this.pokemons$ = this.searchTerms.pipe(
      //eliminer les recherches tres rapproché dans le temps
      //{..."a"."ab"..."abz"."ab".....}
      debounceTime(300),
      // Operateur qui attend avoir un changement dans la recherche avant de faire une requette
      //{....."ab"...."ab"...."abc".....}
      distinctUntilChanged(),
      //{....."ab".........."abc".....}
      //map((term)=>.pokemonService.searchPokemonList(term))
      //{.....Observable<"ab">..... Observable<"abc">}
      switchMap((term) => this.pokemonSrvice.searchPokemonList(term))
      //{.....PokemonList(ab)..... PokemonList(abc)}// Flus de resultat qui vient du serveur
    );
  }

  search(term: string) {
    //poussez le term de recherche dans le flux de donnée
    this.searchTerms.next(term);
  }

  goToDetail(pokemon: Pokemon) {
    // Redireger l'utilisateur vers la page detail du pokemon choisi
    const link = ["/pokemon", pokemon.id];
    this.router.navigate(link);
  }
}
