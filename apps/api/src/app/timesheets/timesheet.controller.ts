import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTimesheetDto } from '../auth/dto/create-timesheet.dto';
import { TimesheetService } from './timesheet.service';
import { UpdateTimesheetDto } from '../auth/dto/update-timesheet.dto';
import { GetUser } from '../users/user.decorator';
import { Timesheet } from './timesheet.model';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTimesheet(@Body() createTimesheetDto: CreateTimesheetDto, @GetUser() user) {

    try {
      const userId = user.id;
      return this.timesheetService.createTimesheet(createTimesheetDto,userId);
    } catch (err) {
      throw new InternalServerErrorException('Error creating timesheet');
    }
  }

  @Get()
  findAllTimesheets(@GetUser() user) {
    try {
      const userId = user.id;
      return this.timesheetService.findAllTimesheets(userId);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheets');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneTimesheet(@Param('id') id: number, @GetUser() user): Promise<Timesheet> {
    try {
      const userId = user.id;
      const timesheet =  await this.timesheetService.findOneTimesheet(id, userId);
      if (!timesheet) {
        throw new NotFoundException(`Timesheet with ID ${id} not found`);
      }
      return timesheet;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching timesheet');
    }
  }


  @Patch(':id')
  updateTimesheet(
    @Param('id') id: number,
    @Body() updateTimesheetDto: UpdateTimesheetDto,
  ) {
    try {
      return this.timesheetService.updateTimesheet(+id, updateTimesheetDto);
    } catch (error) {
      throw new InternalServerErrorException('Error updating timesheet');
    }
  }

  @Delete(':id')
  deleteTimesheet(@Param('id') id: number) {
    try {
      return this.timesheetService.deleteTimesheet(+id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting timesheet');
    }
  }
}
