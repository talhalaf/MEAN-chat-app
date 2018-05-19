const expect = require('expect');

const {Users} = require('./users');

describe('Users',()=>{
    var users;
    var numberOfUsers;
    beforeEach(() =>{
        users = new Users();
        users.users =[{
            id:'1',
            name:'Hila',
            room:'love'
        },{
            id:'2',
            name:'Yossi',
            room:'B'
        },{
            id:'3',
            name:'Tal',
            room:'love'
        }]
        numberOfUsers = users.users.length;
    });


    it('should add new user',()=>{
        var users = new Users();
        var user = {
            id:'123',
            name:'Tal',
            room:'A'
        };
        var resUser = users.addUser(user.id,user.name,user.room);
        expect(users.users).toEqual([user]);
    })
    it('should remove user',()=>{
        userId='1';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(numberOfUsers-1);
    });
    it('should not remove user',()=>{
        userId='200';
        var user = users.removeUser(userId);
        expect(user).toBe(undefined);
    })
    it('should find user',()=>{
        var userId = '1';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId);
    });
    it('should not find user',()=>{
        var userId = '200';
        var user = users.getUser(userId);
        expect(user).toBe(undefined);
        expect(users.users.length).toBe(numberOfUsers);
    });
    it('should return names for love room',()=>{
        var userList = users.getUserList('love');
        expect(userList).toEqual(['Hila','Tal']);
    });
    it('should return Yossi for B room',()=>{
        var userList = users.getUserList('B');
        expect(userList).toEqual(['Yossi']);
    });
});