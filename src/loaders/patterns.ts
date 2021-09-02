

// // *******************************
// //        AbstractFactory
// // *******************************

// export class AbstractFactory {
//   createFactoryDao() { return new FactoryDao(); };
//   createFactoryUser() { return new FactoryUser(); };
// }

// // *******************************
// //            Factory
// // *******************************

// export class FactoryDao {
//   constructor() { };

//   getUserDao() { };

//   getFurnitureDao() { };

//   getCategoriesDao() { };
// }

// export class FactoryUser {
//   constructor() { };

//   getUserDao() { };

//   getFurnitureDao() { };

//   getCategoriesDao() { };
// }

// // *******************************
// //           FactoryDao
// // *******************************

// interface Dao {}

// export class NotificationDao implements Dao {
//   constructor(public conectionBD: DBInstance) {};

//   createNotification(): void {};
//   deleteNotification(): void {};
//   updateNotification(): void {};
//   getNotifications(): Notification[] { return []};
// }

// export class UserDao implements Dao {
//   constructor(public conectionBD: DBInstance) {};

//   createUser(): void {};
//   deleteUser(): void {};
//   updateUser(): void {};
//   getUsers(): User[] {return []};
// }

// export class FurnitureDao implements Dao {
//   constructor(public conectionBD: DBInstance) {};

//   createFurniture(): void {};
//   deleteFurniture(): void {};
//   updateFurniture(): void {};
//   getFurnitures(): Furniture[] {return []};
// }

// export class CategoriesDao implements Dao {
//   constructor(public conectionBD: DBInstance) {};

//   createCategories(): void {};
//   deleteCategories(): void {};
//   updateCategories(): void {};
//   getCategoriess(): Categories[] {return []};
// }

// // *******************************
// //        FactoryDaoModels
// // *******************************

// export class Notification {
//   constructor(
//     private idNotification: number,
//     private idUser: number,
//     private type: string,
//     private description: string,
//   ) {};

//   getDescription() { return this.description };
//   setDescription(description: string) { this.description = description };

//   getType() { return this.type };
//   setType(type: string) { this.type = type };
// }

// export class User {
//   constructor(
//     private idUser: number,
//     private idForumOfFurniture: number,
//     private idUser: number,
//     private description: string,
//     private configuration: IConfiguration,
//   ) {};

//   sendUser(): void {};
// }

// export class Furniture {
//   constructor(
//     private idFurniture: number,
//     private furnitureName: string,
//     private listCategories: Categories[],
//   ) {};

//   getFurnitureName() { return this.furnitureName };
//   setFurnitureName(furnitureName: string) { this.furnitureName = furnitureName };
// }

// export class Categories {
//   constructor(
//     private idCategories: number,
//     private idFurniture: number,
//     private title: string,
//     private description: string,
//     private category: string,
//   ) {};

//   getIterator() { return new Iterator(this) };
// }

// // *******************************
// //            Iterator
// // *******************************

// interface IIterator {
//   hasNext(): boolean;
//   next(): Object;
// }

// export class Iterator implements IIterator{
//   constructor(public categories: Categories) {};
  
//   hasNext(): boolean { return true };
//   next() { return this.categories };
// }

// // *******************************
// //           FactoryUser
// // *******************************

// export class StudentDao {
//   constructor(public conectionBD: DBInstance) {};

//   createStudent() {};
//   deleteStudent() {};
//   updateStudente() {};
//   getStudents(): Student[] { return [] };
// }

// export class TeacherDao {
//   constructor(public conectionBD: DBInstance) {};

//   createTeacher() {};
//   deleteTeacher() {};
//   updateTeachere() {};
//   getTeachers(): Teacher[] { return [] };
// }

// export class AdminDao {
//   constructor(public conectionBD: DBInstance) {};

//   createAdmin() {};
//   deleteAdmin() {};
//   updateAdmine() {};
//   getAdmins(): Admin[] { return [] };
// }

// // *******************************
// //        FactoryUserModels
// // *******************************

// export class User {
//   constructor(
//     idUser: number,
//     name: string,
//     lastName: string,
//     email: string,
//     password: string,
//     type: string,
//   ) {};
// }

// export class Student extends User implements IObserver{
//   constructor(
//     private idUser: number,
//     private name: string,
//     private lastName: string,
//     private email: string,
//     private password: string,
//     private type: string,
//     private idStudent: number,
//     private cicle: string,
//     private codeStudent: string,
//   ) {
//     super(idUser, name, lastName, email, password, type);
//   };

//   notify() {};
//   seeNote(): number { return 3 };
// }

// export class Teacher extends User implements IObserver {
//   constructor(
//     private idUser: number,
//     private name: string,
//     private lastName: string,
//     private email: string,
//     private password: string,
//     private type: string,
//     private idTeacher: number,
//     private codeTeacher: string,
//     private listNotes: Note[],
//   ) {
//     super(idUser, name, lastName, email, password, type);
//   };

//   notify() {};
//   addNote() {};
//   seeNote(): Note[] { return [] };
// }

// export class Note {
//   constructor(
//     private idNote: number,
//     private idEnrollment: number,
//     private note: number,
//   ) {};

//   getNote() { return this.note };
//   setNote(note: number) { this.note = note };
// }

// export class Admin extends User {
//   constructor(
//     private idUser: number,
//     private name: string,
//     private lastName: string,
//     private email: string,
//     private password: string,
//     private type: string,
//     private idAdmin: number,
//   ) {
//     super(idUser, name, lastName, email, password, type);
//   };

//   enroll() {};
  
// }

// // *******************************
// //            Observer
// // *******************************

// export interface IConfiguration {
//   registerObserver(): void;
//   removeObserver(): void;
//   notifyObserver(): void;
// }

// export interface IObserver {
//   notify(): void;
// }

// export class configuration implements IConfiguration {
//   constructor(listObserver: IObserver[]){};

//   registerObserver(): void {};
//   removeObserver(): void {};
//   notifyObserver(): void {};
// }

// // *******************************
// //            Fecade
// // *******************************

// export interface IFacade {
//   furnitureManagment(): void;
// }

// export class Fecade implements IFacade {
//   createCategories: CreateCategories;
//   updateCategories: UpdateCategories;
//   userManagment : UserManagment;
//   constructor(
//     idCategories: number,
    
//   ) {
//     this.createCategories = new CreateCategories(idCategories);
//     this.updateCategories = new UpdateCategories(idCategories);
//     this.userManagment = new UserManagment();
//   }

//   furnitureManagment() {};
// }

// export class CreateCategories {
//   constructor(idCategories: number) {};
// }
// export class UpdateCategories {
//   constructor(idCategories: number) {};
// }

// export class UserManagment {
//   constructor() {};
  
//   createUser(description: string) {};
//   listUsers(idFurniture: number): User[] { return [] };
// }