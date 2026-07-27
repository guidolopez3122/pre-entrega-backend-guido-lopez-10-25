# TODO - Plan de Implementación

## Fase 1: Tests Funcionales
- [x] 1.1. Crear configuración de Jest (`jest.config.js` o en `package.json`)
- [x] 1.2. Crear `src/__tests__/setup.js` - Configuración global con mocks
- [x] 1.3. Crear `src/__tests__/products.test.js` - Tests para endpoints de productos
- [x] 1.4. Crear `src/__tests__/carts.test.js` - Tests para endpoints de carritos
- [x] 1.5. Crear `src/__tests__/sessions.test.js` - Tests para endpoints de sesión
- [x] 1.6. Crear DAOs simplificados (Adoptions.js, Pets.js, Users.js)
- [x] 1.7. Crear servicios centralizados (`services/index.js`)
- [x] 1.8. Renovar controllers (adoptions.controller.js, pets.controller.js, users.controller.js)
- [x] 1.9. Crear users.router.js y actualizar routers existentes
- [x] 1.10. Crear tests funcionales completos para adoption.router.js (23 tests)
- [x] 1.11. Actualizar jest.config.cjs para incluir carpeta test/
- [x] 1.12. Ejecutar tests y verificar → ✅ 23 tests passed

## Fase 2: Dockerización
- [x] 2.1. Crear `Dockerfile` optimizado multi-stage
- [x] 2.2. Crear `.dockerignore`
- [ ] 2.3. Construir imagen Docker y verificar

## Fase 3: Documentación
- [x] 3.1. Actualizar `README.md` con documentación completa
- [ ] 3.2. Recopilar evidencias (logs)

## Fase 4: Entrega
- [ ] 4.1. Verificar todo el proyecto
- [ ] 4.2. Preparar resumen final
