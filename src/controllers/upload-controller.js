// TODO) Upload-Controller: 이미지 업로드 처리
export const uploadController = {
  upload(req, res) {
    // multer에서 파일 없으면 에러 반환
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '업로드할 이미지가 필요합니다',
      });
    }

    const file = req.file;
    const url = `/uploads/${file.filename}`;

    res.status(201).json({
      success: true,
      message: '이미지 업로드 성공',
      data: {
        fileName: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url,
      },
    });
  },
};
