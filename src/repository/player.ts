import {Player, Season} from '../mysql/schema';
import SQ from 'sequelize';

const Op = SQ.Op;

export async function getplayerAllSeason(name: string) {
    const names = name.split(',').map(p => p.trim());

    return Player.findAll({
        attributes: ['id', 'name'],
        where: {
            [Op.or]: names.map(n => {
                return {
                    name: {
                        [Op.like]: `%${n}%`
                    }
                }
            })
        },
        include: [{
            attributes: ['classname', 'seasonImg'],
            model: Season,
            required: true,
        }]
    })
}

export async function getPlayerInfo(id: string) {
    return Player.findOne({
        where: { id }
    });
}