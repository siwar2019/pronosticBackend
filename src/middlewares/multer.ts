import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(null, `${process.env.UPLOAD_EVENTS_PATH}`);
  },
  filename: (
    req: any,
    file: { fieldname: string; originalname: string },
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const storageLogo = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(null, `${process.env.UPLOAD_PATH}`);
  },
  filename: (
    req: any,
    file: { fieldname: string; originalname: string },
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const storageCSV = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(null, "./uploads/");
  },
  filename: (
    req: any,
    file: { fieldname: string; originalname: string },
    callBack: (arg0: any, arg1: string) => void
  ) => {
    callBack(null, file.fieldname + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const uploadLogo = multer({
  storage: storageLogo,
});

const uploadCSV = multer({
  storage: storageCSV,
});

export const uploads = (req: any, res: any, next: any) => {
  return upload.single("file")(req, res, next);
};

export const uploadLogos = (req: any, res: any, next: any) => {
  return uploadLogo.single("images")(req, res, next);
};

export const uploadsCSV = (req: any, res: any, next: any) => {
  return uploadCSV.single("equipeListe")(req, res, next);
};
