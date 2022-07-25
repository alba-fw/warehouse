export const Interface = (interfaceName:string) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const metadataKey = 'design:paramtypes';
    const metadata = Reflect.getMetadata(metadataKey, target);
    metadata[parameterIndex] = interfaceName;
    Reflect.defineMetadata(metadataKey, metadata, target);
}