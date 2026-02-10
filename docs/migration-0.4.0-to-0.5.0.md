# Migracja z 0.4.0 do 0.5.0

Wersja 0.5.0 wprowadza znaczące zmiany w wewnętrznej architekturze oraz API, mające na celu poprawę wydajności, bezpieczeństwa operacji współbieżnych oraz rozszerzenie możliwości zapytań i aktualizacji.

## Najważniejsze zmiany (Breaking Changes)

### 1. Zmiana nazwy `CollectionManager` na `Collection`
Klasa `CollectionManager` została zastąpiona przez `Collection`. Jeśli używałeś typowania jawnego, musisz zaktualizować nazwy klas.

**Stare API (0.4.0):**
```typescript
const users: CollectionManager<User> = db.c('users');
```

**Nowe API (0.5.0):**
```typescript
const users: Collection<User> = db.c('users');
```

### 2. Nowa struktura `ValtheraClass`
Wewnętrzna logika została odseparowana od głównej klasy. `ValtheraClass` korzysta teraz z `dbAction` (implementacja `ActionsBase`) oraz `Executor`.

- `init()` jest teraz wywoływane automatycznie przy pierwszej operacji, nie ma potrzeby ręcznego wywoływania go w większości przypadków.
- Dodano właściwość `version` do instancji klasy.

### 3. Zautomatyzowane zarządzanie operacjami
Dzięki nowemu `Executor`, wszystkie operacje na bazie danych są teraz kolejkowane, co eliminuje problemy z wyścigami (race conditions) przy jednoczesnym dostępie do plików.

## Nowe funkcjonalności

### 1. Rozszerzone operatory aktualizacji
Wprowadzono zaawansowane operatory dla metody `update` i `updateOne`:

- `$push`: Dodaje element do tablicy.
- `$pushset`: Dodaje element do tablicy, jeśli jeszcze go tam nie ma (zapewnia unikalność).
- `$pull`: Usuwa element z tablicy.
- `$pullall`: Usuwa wszystkie wystąpienia podanych elementów z tablicy.
- `$merge`: Płytkie scalanie obiektów.
- `$deepMerge`: Głębokie scalanie obiektów.
- `$inc` / `$dec`: Inkrementacja i dekrementacja wartości numerycznych.
- `$unset`: Usuwanie pól z obiektu.
- `$rename`: Zmiana nazwy pola.
- `$set`: Ustawienie wartości.

**Przykład:**
```typescript
await db.c('users').updateOne({ id: 1 }, {
    $inc: { loginCount: 1 },
    $pushset: { tags: 'active' },
    $merge: { profile: { lastSeen: new Date() } }
});
```

### 2. Zaawansowane opcje wyszukiwania (`FindOpts`)
Metody `find` i `findOne` wspierają teraz opcje `select` oraz `exclude` w trzecim argumencie, pozwalające na wybór konkretnych pól lub ich wykluczenie z wyniku.

```typescript
const users = await db.c('users').find({}, {}, {
    select: ['username', 'email']
});
```

### 3. Nowe narzędzia: `createMemoryValthera` oraz `forgeValthera`
Wprowadzono pomocnicze funkcje do szybkiego tworzenia i pracy z bazami danych:

- `createMemoryValthera`: Szybkie tworzenie bazy danych w pamięci RAM.
- `forgeValthera` / `forgeTypedValthera`: Wykorzystuje Proxy, aby umożliwić dostęp do kolekcji bezpośrednio przez właściwości obiektu bazy danych.

**Przykład `forgeValthera`:**
```typescript
import { forgeValthera, ValtheraMemory } from '@wxn0brp/db-core';

const db = forgeValthera(new ValtheraMemory());
await db.users.add({ name: 'John' }); // Dynamiczny dostęp do kolekcji 'users'
```

### 4. Lepsze wsparcie dla TypeScript
Wiele typów zostało przepisanych, aby zapewnić lepsze podpowiedzi w IDE, szczególnie w zakresie operatorów aktualizacji oraz typowania kolekcji.
