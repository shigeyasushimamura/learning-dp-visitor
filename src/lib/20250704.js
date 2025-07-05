"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = exports.UserMapper = exports.UserDAO = exports.User = exports.NullUserDTO = void 0;
// Null Object for DTO
var NullUserDTO = /** @class */ (function () {
    function NullUserDTO() {
        this.id = 0;
        this.name = "Guest";
    }
    NullUserDTO.INSTANCE = new NullUserDTO();
    return NullUserDTO;
}());
exports.NullUserDTO = NullUserDTO;
// =======================
// Domain Entity
// =======================
var User = /** @class */ (function () {
    function User(id, name) {
        this.id = id;
        this.name = name;
    }
    User.prototype.greet = function () {
        return "Hello, ".concat(this.name);
    };
    return User;
}());
exports.User = User;
// =======================
// DAO (Data Access Object)
// =======================
var UserDAO = /** @class */ (function () {
    function UserDAO() {
        this.db = new Map([
            [1, { id: 1, name: "Alice" }],
            [2, { id: 2, name: "Bob" }],
        ]);
    }
    UserDAO.prototype.findById = function (id) {
        var dto = this.db.get(id);
        if (!dto) {
            return NullUserDTO.INSTANCE;
        }
        return dto;
    };
    return UserDAO;
}());
exports.UserDAO = UserDAO;
// =======================
// Mapper
// =======================
var UserMapper = /** @class */ (function () {
    function UserMapper() {
    }
    UserMapper.toEntity = function (dto) {
        if (dto === NullUserDTO.INSTANCE) {
            return null;
        }
        return new User(dto.id, dto.name);
    };
    return UserMapper;
}());
exports.UserMapper = UserMapper;
// =======================
// Repository
// =======================
var UserRepository = /** @class */ (function () {
    function UserRepository() {
        this.dao = new UserDAO();
    }
    UserRepository.prototype.findById = function (id) {
        var dto = this.dao.findById(id);
        return UserMapper.toEntity(dto);
    };
    return UserRepository;
}());
exports.UserRepository = UserRepository;
// =======================
// Usage
// =======================
var repo = new UserRepository();
var user1 = repo.findById(1);
console.log(user1 === null || user1 === void 0 ? void 0 : user1.greet()); // "Hello, Alice"
var user2 = repo.findById(999);
console.log(user2 === null || user2 === void 0 ? void 0 : user2.greet()); // undefined
// DB・API <--> DAO <--> DTO <--> Mapper <--> Repository <--> Entity
// DAO(Data Access Object): DBと話す専門の人。技術的なデータの読み書き担当
// DTO(Data Transfer Object): DAOから取得したデータ構造だけのオブジェクト
// Mapper : DTO と Entityの翻訳
// Repository: ドメインから見たデータ倉庫
// Entity : 実際のインスタンス
