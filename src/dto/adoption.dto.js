export class AdoptionDTO {
  constructor(adoption) {
    this.id = adoption._id || adoption.id;
    this.pet = adoption.pet;
    this.user = adoption.user;
    this.adoptionDate = adoption.adoptionDate;
    this.status = adoption.status;
    this.notes = adoption.notes;
    this.createdAt = adoption.createdAt;
    this.updatedAt = adoption.updatedAt;
  }
}
