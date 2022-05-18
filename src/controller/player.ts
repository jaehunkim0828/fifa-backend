import {Request, Response, NextFunction} from 'express';
import axios from "axios";
import SQ from 'sequelize';

import { config } from "../config";
import { db, sequelize } from '../db';

const DataTypes = SQ.DataTypes;

const Player = sequelize.define('spids', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { timestamps: false });

const Season = sequelize.define('seasons', {
    "seasonId": {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    "className": {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    "seasonImg": {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { timestamps: false });

export async function getSpid(req: Request, res: Response, next: NextFunction) {
    const spids = await axios.get(
        'https://static.api.nexon.co.kr/fifaonline4/latest/spid.json', {
            headers: {
                Authorization: config.api.fifaKey,
            }
        }
    )
    spids.data.map(async (player: any) => {
        const string = player.id.toString();
        console.log(typeof string);
        const seasonId = parseInt(string.substring(0,3))

        await Player.create({...player, seasonId}).then(console.log);
    })
    res.status(200).send('done');
}

export async function getSeason(req: Request, res: Response, next: NextFunction) {
    const season = await axios.get(
        'https://static.api.nexon.co.kr/fifaonline4/latest/seasonid.json', {
            headers: {
                Authorization: config.api.fifaKey,
            }
        }
    )
    season.data.map(async (season: any) => {
        await Season.create(season).then(console.log);
    })
    res.status(200).send('season');
}

export async function getPlayerById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = await Player.findOne({
        where: { id }
    });
    res.send(data);
    // or Player.findByPk(id);
}