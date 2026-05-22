import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';
import { CreateRoleDto } from './dto/createRole.dto';

@Injectable()
export class RoleService {

    constructor(@InjectModel(Role) private roleModel: typeof Role){}

    async create(dto: CreateRoleDto){
        try{
            const role = await this.roleModel.findOne({where: {name: dto.name}})
            if (role){
                throw new HttpException('Такая роль уже создана', HttpStatus.BAD_REQUEST)
            }
            return await this.roleModel.create(dto)
        } catch(e){
            throw e
        }
    }

    async getAll(){
        try{
            return await this.roleModel.findAll()
        } catch(e){
            console.log(e)
        }
    }

    async getOne(name: string){
        const role = await this.roleModel.findOne({where: {name}})
        if (!role){
            throw new HttpException('Такой роли нет', HttpStatus.NOT_FOUND)
        }
        return role
    }

    async delete(name: string){
        const role = await this.roleModel.destroy({where: {name}})
        if(role == 0){
            throw new HttpException('Роль не найдена или уже удалена', HttpStatus.NOT_FOUND)
        }
        return {message: 'Роль успешно удалена'}
    }

    
}
