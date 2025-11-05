# WineLog – PostgreSQL Schema

## 1. Tabele

### 1.1 Typy ENUM

| Enum | Wartości |
|------|----------|
| batch_status_enum | `active`, `archived` |
| batch_type_enum   | `red_wine`, `white_wine`, `rose_wine`, `fruit_wine`, `mead` |
| stage_name_enum   | `preparation`, `press_or_maceration`, `separation`, `primary_fermentation`, `secondary_fermentation`, `clarification`, `racking`, `maturation`, `bottling` |

---

### 1.2 templates

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| id | uuid | PRIMARY KEY, default `gen_random_uuid()` |
| name | text | NOT NULL, UNIQUE |
| type | batch_type_enum | NOT NULL |
| version | smallint | NOT NULL DEFAULT 1 |
| created_at | timestamptz | NOT NULL DEFAULT now() |

---

### 1.3 template_stages

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| id | uuid | PRIMARY KEY, default `gen_random_uuid()` |
| template_id | uuid | NOT NULL, REFERENCES `templates(id)` ON DELETE CASCADE |
| position | smallint | NOT NULL |
| name | stage_name_enum | NOT NULL |
| description | text | NOT NULL |
| instructions | text | NOT NULL |
| materials | text[] | |
| days_min | smallint | |
| days_max | smallint | |
| created_at | timestamptz | NOT NULL DEFAULT now() |

UNIQUE(`template_id`, `position`)

---

### 1.4 batches

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| id | uuid | PRIMARY KEY, default `gen_random_uuid()` |
| user_id | uuid | NOT NULL, REFERENCES `auth.users(id)` ON DELETE CASCADE |
| template_id | uuid | REFERENCES `templates(id)` |
| name | varchar(100) | NOT NULL, CHECK (char_length(name) <= 100) |
| type | batch_type_enum | NOT NULL |
| status | batch_status_enum | NOT NULL DEFAULT 'active' |
| started_at | date | NOT NULL DEFAULT current_date |
| completed_at | date | |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| updated_at | timestamptz | NOT NULL DEFAULT now() |

---

### 1.5 batch_stages

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| id | uuid | PRIMARY KEY, default `gen_random_uuid()` |
| batch_id | uuid | NOT NULL, REFERENCES `batches(id)` ON DELETE CASCADE |
| template_stage_id | uuid | NOT NULL, REFERENCES `template_stages(id)` |
| started_at | date | |
| completed_at | date | |
| created_at | timestamptz | NOT NULL DEFAULT now() |

UNIQUE(`batch_id`, `template_stage_id`)

---

### 1.6 notes

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| id | uuid | PRIMARY KEY, default `gen_random_uuid()` |
| batch_id | uuid | NOT NULL, REFERENCES `batches(id)` ON DELETE CASCADE |
| stage_id | uuid | REFERENCES `batch_stages(id)` ON DELETE CASCADE |
| user_id | uuid | NOT NULL, REFERENCES `auth.users(id)` ON DELETE CASCADE |
| action | varchar(200) | NOT NULL, CHECK (char_length(action) <= 200) |
| observations | varchar(200) | CHECK (char_length(observations) <= 200) |
| created_at | timestamptz | NOT NULL DEFAULT now() |

---

### 1.7 ratings

| Kolumna | Typ | Ograniczenia |
|---------|-----|--------------|
| batch_id | uuid | REFERENCES `batches(id)` ON DELETE CASCADE |
| user_id | uuid | REFERENCES `auth.users(id)` ON DELETE CASCADE |
| rating | smallint | NOT NULL, CHECK (rating BETWEEN 1 AND 5) |
| created_at | timestamptz | NOT NULL DEFAULT now() |

PRIMARY KEY(`batch_id`, `user_id`)

---

## 2. Relacje

* **templates 1↔N template_stages** – etap szablonu należy do jednego szablonu.
* **templates 1↔N batches** – nastaw może być oparty na jednym szablonie.
* **users 1↔N batches** – każdy nastaw należy do jednego użytkownika.
* **batches 1↔N batch_stages** – etapy nastawu wskazują na odpowiedni `template_stage`, z którego pobierane są instrukcje.
* **batch_stages 1↔N notes** – notatki powiązane z etapem nastawu.
* **batches 1↔1 ratings (per user)** – ocenę nastawu dodaje jego właściciel.

## 3. Indeksy

| Tabela | Kolumny | Typ |
|--------|---------|-----|
| batches | (user_id, status) | b-tree |
| batch_stages | (batch_id, template_stage_id) | b-tree |
| notes | (batch_id, created_at DESC) | b-tree |
| template_stages | (template_id, position) | b-tree |
| ratings | (batch_id) | b-tree |

## 4. Polityki RLS

1. `templates`, `template_stages` – TYLKO SELECT dla `auth.role() = 'authenticated'`.
2. `batches`, `notes`, `ratings` –
   * ENABLE ROW LEVEL SECURITY;
   * POLICY "user_is_owner" FOR ALL USING (`user_id` = auth.uid());
3. `batch_stages` –
   * ENABLE ROW LEVEL SECURITY;
   * POLICY "owner_via_batch" FOR ALL USING (EXISTS (SELECT 1 FROM batches b WHERE b.id = batch_stages.batch_id AND b.user_id = auth.uid()));

## 5. Dodatkowe uwagi

* Schemat spełnia 3NF; `batch_stages` przechowuje tylko dane progresu, a treści pobierane są z `template_stages` (brak duplikacji).
* Przy wzroście danych można dodać partycjonowanie (np. `notes` po `batch_id`) lub materializowane widoki dla dashboardu.
* Wszystkie FK używają `ON DELETE CASCADE`, co wspiera pełne usunięcie danych użytkownika podczas kasowania konta.
