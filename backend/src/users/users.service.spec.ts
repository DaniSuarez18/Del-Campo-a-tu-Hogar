import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue([
      { id: '1', name: 'Daniel', email: 'daniel@test.com', role: 'campesino' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('debería retornar un arreglo de usuarios (findAll)', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      { id: '1', name: 'Daniel', email: 'daniel@test.com', role: 'campesino' },
    ]);
  });
});