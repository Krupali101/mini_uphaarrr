const mongoose = require('mongoose');
const requireAdmin = require('./adminAuth');
const connectDB = require('./db');
const { getErrorResponse, methodNotAllowed, readJsonBody, sendJson } = require('./http');
const { Announcement } = require('./models');
const { serializeAnnouncement } = require('./serializers');

function input(body) {
  const text = String(body.text || '').trim();
  if (!text) { const error = new Error('Announcement text is required.'); error.statusCode = 400; throw error; }
  return { text, link: String(body.link || '').trim(), active: body.active === undefined ? true : Boolean(body.active) };
}

async function announcementsCollectionHandler(req, res) {
  try {
    await connectDB();
    if (req.method === 'GET') {
      if (req.query?.includeInactive === 'true') {
        if (!requireAdmin(req, res)) return;
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        sendJson(res, 200, { announcements: announcements.map(serializeAnnouncement) });
        return;
      }
      const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
      sendJson(res, 200, {
        announcement: serializeAnnouncement(announcements[0]),
        announcements: announcements.map(serializeAnnouncement),
      });
      return;
    }
    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const announcement = await Announcement.create(input(readJsonBody(req)));
      sendJson(res, 201, { announcement: serializeAnnouncement(announcement) });
      return;
    }
    methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    if (error.statusCode) { sendJson(res, error.statusCode, { message: error.message }); return; }
    const response = getErrorResponse(error); sendJson(res, response.statusCode, response.body);
  }
}

async function announcementItemHandler(req, res) {
  try {
    await connectDB();
    const id = req.query?.id || req.params?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) { sendJson(res, 400, { message: 'Announcement id is required.' }); return; }
    if (!requireAdmin(req, res)) return;
    if (req.method === 'PUT') {
      const announcement = await Announcement.findByIdAndUpdate(id, input(readJsonBody(req)), { new: true, runValidators: true });
      if (!announcement) { sendJson(res, 404, { message: 'Announcement not found.' }); return; }
      sendJson(res, 200, { announcement: serializeAnnouncement(announcement) }); return;
    }
    if (req.method === 'DELETE') {
      const announcement = await Announcement.findByIdAndDelete(id);
      if (!announcement) { sendJson(res, 404, { message: 'Announcement not found.' }); return; }
      sendJson(res, 200, { ok: true }); return;
    }
    methodNotAllowed(res, ['PUT', 'DELETE']);
  } catch (error) {
    if (error.statusCode) { sendJson(res, error.statusCode, { message: error.message }); return; }
    const response = getErrorResponse(error); sendJson(res, response.statusCode, response.body);
  }
}

module.exports = { announcementsCollectionHandler, announcementItemHandler };
