import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { ArtisteRepo } from '../../data/artiste';
import { PointRepo } from '../../data/point';
import { WeekRepo } from '../../data/week';

export class ArtisteController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const artiste_name = req.query.name
        ? { artiste_name: { $regex: req.query.name, $options: 'i' } }
        : {};

      const record_label = req.query.label
        ? { record_label: { $regex: req.query.label, $options: 'i' } }
        : {};

      const min_price = req.query.min_price
        ? { price: { $gte: req.query.min_price } }
        : {};

      const max_price = req.query.max_price
        ? { price: { $lte: req.query.max_price } }
        : {};

      const query = {
        ...artiste_name,
        ...record_label,
        ...min_price,
        ...max_price
      };

      const [artistes, thisWeek] = await Promise.all([
        ArtisteRepo.getPaged({
          query,
          sort: req.query.sort || 'created_at',
          page: Number(req.query.page),
          per_page: Number(req.query.per_page)
        }),
        await WeekRepo.getModel().find().sort({ created_at: -1 }).limit(1)
      ]);

      const artistePoints = await PointRepo.get({
        query: {
          artiste: { $in: artistes.result.map(it => it._id) },
          week_number: thisWeek[0].week_number
        }
      });

      artistes.result = artistes.result.map(it => {
        const object = it.toObject() as any;
        const points = artistePoints.filter(
          point => point.artiste === it._id
        )[0]?.points;

        return { ...object, points };
      });

      this.handleSuccess(req, res, artistes);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const artiste = await ArtisteRepo.byID(req.params.id);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getPoints = async (req: Request, res: Response) => {
    try {
      const points = await PointRepo.byQuery({
        artiste: req.params.id,
        week_number: req.params.wid
      });

      this.handleSuccess(req, res, points);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const artiste = await ArtisteRepo.create(req.body);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const artistes = new ArtisteController();
