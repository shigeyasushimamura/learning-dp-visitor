// =======================
// DTO
// =======================
export interface UserDTO {
  id: number;
  name: string;
}

// Null Object for DTO
export class NullUserDTO implements UserDTO {
  readonly id = 0;
  readonly name = "Guest";

  private constructor() {}

  static readonly INSTANCE = new NullUserDTO();
}

// =======================
// Domain Entity
// =======================
export class User {
  readonly id: number;
  readonly name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  greet(): string {
    return `Hello, ${this.name}`;
  }
}

// =======================
// DAO (Data Access Object)
// =======================
export class UserDAO {
  private db: Map<number, UserDTO> = new Map([
    [1, { id: 1, name: "Alice" }],
    [2, { id: 2, name: "Bob" }],
  ]);

  findById(id: number): UserDTO {
    const dto = this.db.get(id);
    if (!dto) {
      return NullUserDTO.INSTANCE;
    }
    return dto;
  }
}

// =======================
// Mapper
// =======================
export class UserMapper {
  static toEntity(dto: UserDTO): User | null {
    if (dto === NullUserDTO.INSTANCE) {
      return null;
    }
    return new User(dto.id, dto.name);
  }
}

// =======================
// Repository
// =======================
export class UserRepository {
  private dao = new UserDAO();

  findById(id: number): User | null {
    const dto = this.dao.findById(id);
    return UserMapper.toEntity(dto);
  }
}

// =======================
// Usage
// =======================
const repo = new UserRepository();

const user1 = repo.findById(1);
console.log(user1?.greet()); // "Hello, Alice"

const user2 = repo.findById(999);
console.log(user2?.greet()); // undefined

// DB・API <--> DAO <--> DTO <--> Mapper <--> Repository <--> Entity
// DAO(Data Access Object): DBと話す専門の人。技術的なデータの読み書き担当
// DTO(Data Transfer Object): DAOから取得したデータ構造だけのオブジェクト
// Mapper : DTO と Entityの翻訳
// Repository: ドメインから見たデータ倉庫
// Entity : 実際のインスタンス
