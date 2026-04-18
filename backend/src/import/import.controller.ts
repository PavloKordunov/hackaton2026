import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ImportResult } from './dto/land-record.dto';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  /**
   * POST /import/land
   * Accepts a multipart/form-data upload with field name "file".
   * Returns normalised land parcel records and a detailed error log.
   */
  @Post('land')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async importLand(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: {
      buffer?: Buffer;
    },
  ): Promise<ImportResult> {
    if (!file?.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    return this.importService.processLandXlsx(file.buffer);
  }
}
