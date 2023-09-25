import { Controller, Get, Param } from '@nestjs/common';

@Controller('network')
export class NetworkController {
  // delete?
  @Get('comment/:commentText')
  async fetchComments(@Param() params) {
    const fetchNeuralNetworkResult = async (data) => {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
        {
          headers: {
            Authorization: 'Bearer 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',
          },
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    };

    const [response] = await fetchNeuralNetworkResult({
      inputs: `${params.commentText}`,
    });

    const max = response.sort(
      (
        a: { score: number; label: string },
        b: { score: number; label: string }
      ) => b.score - a.score
    )[0];

    return max;
  }
}
