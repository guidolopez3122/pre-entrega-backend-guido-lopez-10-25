export class PetDTO {
  constructor(pet) {
    this.id = pet._id || pet.id;
    this.name = pet.name;
    this.species = pet.species;
    this.breed = pet.breed;
    this.age = pet.age;
    this.weight = pet.weight;
    this.color = pet.color;
    this.description = pet.description;
    this.status = pet.status;
    this.medicalNotes = pet.medicalNotes;
    this.vaccinated = pet.vaccinated;
    this.sterilized = pet.sterilized;
    this.images = pet.images;
    this.adoptedBy = pet.adoptedBy;
    this.adoptedAt = pet.adoptedAt;
    this.createdAt = pet.createdAt;
    this.updatedAt = pet.updatedAt;
  }
}
