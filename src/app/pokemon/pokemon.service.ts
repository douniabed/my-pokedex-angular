import { Injectable } from "@angular/core";
import { Pokemon } from "./pokemon";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, of, pipe, tap } from "rxjs";

@Injectable()
export class PokemonService {
  constructor(private http: HttpClient) {}

  // Retourner un flux qui contiendra les pokemons
  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>("api/pokemons").pipe(
      // tap c'est comme un console.log pour les observables
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, []))
    );
  }

  getPokemonById(pokemonId: number): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`api/pokemons/${pokemonId}`).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  searchPokemonList(term: string): Observable<Pokemon[]> {
    if (term.length <= 1) {
      return of([]);
    }
    return this.http.get<Pokemon>(`api/pokemons/?name=${term}`).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, []))
    );
  }

  updatePokemon(pokemon: Pokemon): Observable<null> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application.json" }),
    };

    return this.http.put("api/pokemons", pokemon, httpOptions).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, null))
    );
  }

  deletePokemonById(pokemonId: number): Observable<null> {
    return this.http.delete(`api/pokemons/${pokemonId}`).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, null))
    );
  }

  addPokemon(pokemon: Pokemon): Observable<Pokemon> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application.json" }),
    };

    return this.http.post<Pokemon>("api/pokemons", pokemon, httpOptions).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, null))
    );
  }
  private log(response: any) {
    console.table(response);
  }

  private handleError(error: Error, errorValue: any) {
    // Intersepter une erreur
    console.error(error);
    return of(errorValue); // of c'est pour créer un flux qui emet une donnée et retourner un tableau vide et eviter que l'appli crache
  }

  getPokemonTypeList(): string[] {
    return [
      "Plante",
      "Feu",
      "Eau",
      "Insecte",
      "Normal",
      "Electrik",
      "Poison",
      "Fée",
      "Vol",
      "Combat",
      "Psy",
    ];
  }
}
