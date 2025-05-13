import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('/users/:id/orders/:orderId')
   // 对象参数
    getUserOrder(@Param() paras: { id: string, orderId: string } ): string {
        return `User ID: ${paras.id}, Order ID: ${paras.orderId}`;
    }
    // 直接拆开
  // getUserOrder(@Param('id') id: string, @Param('orderId') orderId: string): string {
  //   return `User ID: ${id}, Order ID: ${orderId}`;
  // }
}
