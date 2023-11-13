import { Repository } from 'typeorm';
import { Interaction } from './interaction.entity';
import { InteractionDto } from './interaction.dto';

export interface InteractionRepository extends Repository<Interaction> {
  this: Repository<Interaction>;
  createInteraction(dto: InteractionDto): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customInteractionRepository: Pick<InteractionRepository, any> = {
  async createInteraction(
    this: Repository<Interaction>,
    dto: InteractionDto
  ): Promise<void> {
    const interaction = this.create({ ...dto });

    try {
      await this.save(interaction);
    } catch (error) {
      console.log(error);
    }
  },
};
