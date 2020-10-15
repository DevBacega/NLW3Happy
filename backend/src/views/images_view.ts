import Image from '../models/Image';

export default {
  render(image: Image): any {
    return {
      id: image.id,
      url: `http://localhost:3333/uploads/${image.path}`,
    };
  },

  renderMany(images: Image[]): any {
    return images.map(images => this.render(images));
  },
};
