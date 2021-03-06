const FeatureController = require('./feature.controller');
const FeatureService = require('../../services/feature/feature.service');
const FeatureModel = require('../../models/feature.model');
const BoardService = require('../../services/board/board.service');
const CodeblockModel = require('../../models/codeblock.model');

jest.mock('../../services/board/board.service');
jest.mock('../../services/feature/feature.service');

describe('feature controller', () => {
	const existingFeature = new FeatureModel({ name: 'my feature' });
	let req = {
		params: {},
	};

	const res = {
		json: jest.fn(),
		send: jest.fn(),
		status: jest.fn(),
	};

	beforeEach(() => {
		res.status.mockReturnValue(res);
	});

	afterEach(() => {
		res.json.mockClear();
		res.status.mockClear();
		res.send.mockClear();
	});

	describe('getFeature()', () => {
		beforeEach(() => {
			req.params.featureId = 'xxx';
		});

		it('should send the feature returned by the service', (done) => {
			const serviceResponse = Promise.resolve(existingFeature);
			FeatureService.getFeatureById.mockReturnValue(serviceResponse);
			const cr = FeatureController.getFeature(req, res);
			cr.then(() => {
				expect(FeatureService.getFeatureById).toHaveBeenCalledWith('xxx');
				expect(res.json).toHaveBeenCalledWith(existingFeature);
				done();
			});
		});

		it('should return a 404 status code when the feature does not exist', (done) => {
			const serviceResponse = Promise.resolve(null);
			FeatureService.getFeatureById.mockReturnValue(serviceResponse);
			const cr = FeatureController.getFeature(req, res);
			cr.then(() => {
				expect(res.status).toHaveBeenCalledWith(404);
				expect(res.send).toHaveBeenCalledWith('feature does not exist');
				done();
			});
		});

		it('should return a 400 status code when the service throw an error', (done) => {
			const serviceResponse = Promise.reject(new Error('service error'));
			FeatureService.getFeatureById.mockReturnValue(serviceResponse);
			const cr = FeatureController.getFeature(req, res);
			cr.then(() => {
				expect(res.status).toHaveBeenCalledWith(400);
				expect(res.send).toHaveBeenCalledWith('service error');
				done();
			});
		});
	});

	describe('getCodeblocksByFeature', () => {
		let simpleFeaturesCodeblocks = [];
		simpleFeaturesCodeblocks.push(new CodeblockModel({ name: 'hello' }));

		beforeEach(() => {
			req.params.featureId = 'xxx';
		});

		it('should return all codeblocks returned by the service', (done) => {
			const servicePromise = Promise.resolve(simpleFeaturesCodeblocks);
			BoardService.getCodeblocksByFeatureId.mockReturnValue(servicePromise);
			const cr = FeatureController.getAllCodeblocksByFeature(req, res);
			cr.then(() => {
				expect(BoardService.getCodeblocksByFeatureId).toHaveBeenCalledWith(req.params.featureId);
				expect(res.json).toHaveBeenCalledWith(simpleFeaturesCodeblocks);
				done();
			});
		});

		it('should return a 400 status code when the service throw an error', (done) => {
			const serviceResponse = Promise.reject(new Error('service error'));
			BoardService.getCodeblocksByFeatureId.mockReturnValue(serviceResponse);
			const cr = FeatureController.getAllCodeblocksByFeature(req, res);
			cr.then(() => {
				expect(res.status).toHaveBeenCalledWith(400);
				expect(res.send).toHaveBeenCalledWith('service error');
				done();
			});
		});
	});
});
