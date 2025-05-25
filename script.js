let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Свайп влево - можно использовать для переключения между категориями
                const activeButton = document.querySelector('.filter-button.active');
                const nextButton = activeButton.nextElementSibling || document.querySelector('.filter-button:first-child');
                if (nextButton) nextButton.click();
            }
            
            if (touchEndX > touchStartX + 50) {
                // Свайп вправо
                const activeButton = document.querySelector('.filter-button.active');
                const prevButton = activeButton.previousElementSibling || document.querySelector('.filter-button:last-child');
                if (prevButton) prevButton.click();
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Управление фильтрами компонентов
            const componentButtons = document.querySelectorAll('.filter-button');
            const subfilters = document.querySelectorAll('.subfilter');
            const productSections = document.querySelectorAll('.products-section');
            const emptyFilters = document.querySelector('.empty-filters');
            const instructions = document.querySelector('.instructions');
            const compatibilityCheck = document.getElementById('compatibility-check');
            const toggleButton = document.querySelector('.toggle-button');
            const buildContent = document.querySelector('.build-content');
            
            // Добавляем обработчики кликов на пустые слоты
            document.querySelectorAll('.empty-slot').forEach(slot => {
                slot.addEventListener('click', function() {
                    const slotContainer = this.closest('.build-slot');
                    if (!slotContainer) return;
                    
                    // Открываем окно сборки
                    if (!buildContent.classList.contains('expanded')) {
                        buildContent.classList.add('expanded');
                        if (toggleButton) toggleButton.textContent = '-';
                    }

                    // Определяем тип компонента по метке слота
                    const slotLabel = slotContainer.querySelector('.slot-label');
                    if (!slotLabel) return;
                    
                    const slotLabelText = slotLabel.textContent.toLowerCase();
                    let componentType;
                    
                    if (slotLabelText.includes('видеокарт')) componentType = 'gpu';
                    else if (slotLabelText.includes('процессор')) componentType = 'cpu';
                    else if (slotLabelText.includes('материнск')) componentType = 'mb';
                    else if (slotLabelText.includes('блок питани')) componentType = 'psu';
                    else return;
                    
                    // Находим соответствующую кнопку фильтра и кликаем ее
                    const filterButton = document.querySelector(`.filter-button[data-component="${componentType}"]`);
                    if (filterButton) {
                        // Убираем активный класс у всех кнопок
                        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                        // Добавляем активный класс текущей кнопке
                        filterButton.classList.add('active');

                        // Скрываем все подфильтры
                        document.querySelectorAll('.subfilter').forEach(filter => filter.classList.remove('active'));
                        // Скрываем пустое состояние
                        if (emptyFilters) emptyFilters.style.display = 'none';
                        // Скрываем инструкцию
                        if (instructions) instructions.style.display = 'none';

                        // Показываем нужный подфильтр
                        const filterElement = document.getElementById(`${componentType}-filters`);
                        if (filterElement) filterElement.classList.add('active');

                        // Скрываем все секции с товарами
                        document.querySelectorAll('.products-section').forEach(section => section.style.display = 'none');
                        // Показываем нужную секцию
                        const productsElement = document.getElementById(`${componentType}-products`);
                        if (productsElement) productsElement.style.display = 'block';
                        
                        // Прокручиваем к фильтрам
                        const filterSection = document.querySelector('.filter-section');
                        if (filterSection) filterSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    });
                });
        
            // Общая цена сборки
            let totalPrice = 0;
            const totalPriceElement = document.getElementById('total-price');
            
            // Обновление общей цены
            function updateTotalPrice() {
                totalPrice = 0;
                
                // Суммируем цены всех выбранных компонентов
                document.querySelectorAll('.selected-product .product-price').forEach(priceElement => {
                    const priceText = priceElement.textContent.replace(/[^\d]/g, '');
                    const price = parseInt(priceText) || 0;
                    total += price;
                });
                
                const totalPriceElement = document.getElementById('total-price');
                if (totalPriceElement) {
                    totalPriceElement.textContent = total.toLocaleString('ru-RU');
                }
                return total;
            }
            // Проверка совместимости сборки
            function checkCompatibility() {
                if (!compatibilityCheck) return;
                
                const gpuSlot = document.getElementById('gpu-slot');
                const cpuSlot = document.getElementById('cpu-slot');
                const mbSlot = document.getElementById('mb-slot');
                const psuSlot = document.getElementById('psu-slot');
                
                // Удаляем все существующие иконки предупреждений
                document.querySelectorAll('.warning-icon').forEach(icon => icon.remove());
                
                // Проверяем, есть ли выбранные компоненты
                const hasGPU = gpuSlot && gpuSlot.querySelector('.selected-product') && 
                            gpuSlot.querySelector('.selected-product').style.display !== 'none';
                const hasCPU = cpuSlot && cpuSlot.querySelector('.selected-product') && 
                            cpuSlot.querySelector('.selected-product').style.display !== 'none';
                const hasMB = mbSlot && mbSlot.querySelector('.selected-product') && 
                            mbSlot.querySelector('.selected-product').style.display !== 'none';
                const hasPSU = psuSlot && psuSlot.querySelector('.selected-product') && 
                            psuSlot.querySelector('.selected-product').style.display !== 'none';
                
                // Если нет выбранных компонентов
                if (!hasGPU && !hasCPU && !hasMB && !hasPSU) {
                    compatibilityCheck.className = 'compatibility-check empty';
                    compatibilityCheck.textContent = '';
                    return;
                }
                
                // Если есть хотя бы один компонент, но не все
                if (!(hasGPU && hasCPU && hasMB && hasPSU)) {
                    compatibilityCheck.className = 'compatibility-check empty';
                    compatibilityCheck.textContent = 'Выбраны не все компоненты';
                    return;
                }
                
                // Получаем данные о выбранных компонентах
                const gpuButton = document.querySelector('#gpu-products .add-button.active');
                const cpuButton = document.querySelector('#cpu-products .add-button.active');
                const mbButton = document.querySelector('#mb-products .add-button.active');
                const psuButton = document.querySelector('#psu-products .add-button.active');
                
                if (!gpuButton || !cpuButton || !mbButton || !psuButton) return;
                
                const gpuCard = gpuButton.closest('.product-card');
                const cpuCard = cpuButton.closest('.product-card');
                const mbCard = mbButton.closest('.product-card');
                const psuCard = psuButton.closest('.product-card');
                
                if (!gpuCard || !cpuCard || !mbCard || !psuCard) return;
                
                const gpuType = gpuCard.getAttribute('data-type');
                const cpuSocket = cpuCard.getAttribute('data-socket');
                const mbSocket = mbCard.getAttribute('data-socket');
                const mbCpuPower = mbCard.getAttribute('data-cpu-power');
                const psuConnector = psuCard.getAttribute('data-connector');
                const psuCpuConnector = psuCard.getAttribute('data-cpu-connector');
                
                // Проверяем совместимость
                let isCompatible = true;
                let compatibilityMessage = 'Сборка совместима';
                
                // 1. Проверяем совместимость процессора и материнской платы (сокет)
                if (cpuSocket !== mbSocket) {
                    isCompatible = false;
                    compatibilityMessage = 'Несовместимы процессор и материнская плата (сокет)';
                    
                    // Добавляем иконки предупреждения
                    if (cpuSlot) addWarningIcon(cpuSlot);
                    if (mbSlot) addWarningIcon(mbSlot);
                }
                
                // 2. Проверяем совместимость материнской платы и блока питания (питание процессора)
                if (mbCpuPower !== psuCpuConnector) {
                    isCompatible = false;
                    if (compatibilityMessage === 'Сборка совместима') {
                        compatibilityMessage = 'Несовместимы материнская плата и БП (питание CPU)';
                    }
                    
                    // Добавляем иконки предупреждения
                    if (mbSlot) addWarningIcon(mbSlot);
                    if (psuSlot) addWarningIcon(psuSlot);
                }
                
                // 3. Проверяем совместимость видеокарты и блока питания (питание GPU)
                if (gpuType !== psuConnector) {
                    isCompatible = false;
                    if (compatibilityMessage === 'Сборка совместима') {
                        compatibilityMessage = 'Несовместимы видеокарта и БП (питание GPU)';
                    }
                    
                    // Добавляем иконки предупреждения
                    if (gpuSlot) addWarningIcon(gpuSlot);
                    if (psuSlot) addWarningIcon(psuSlot);
                }
                
                // Обновляем отображение проверки совместимости
                if (isCompatible) {
                    compatibilityCheck.className = 'compatibility-check compatible';
                    compatibilityCheck.textContent = 'Сборка совместима';
                } else {
                    compatibilityCheck.className = 'compatibility-check incompatible';
                    compatibilityCheck.textContent = compatibilityMessage;
                }
            }
            // Добавление иконки предупреждения
            function addWarningIcon(slotElement) {
                if (!slotElement) return;
                
                const selectedProduct = slotElement.querySelector('.selected-product');
                if (!selectedProduct) return;
                
                const existingWarning = selectedProduct.querySelector('.warning-icon');
                if (existingWarning) return;
                
                const warningIcon = document.createElement('div');
                warningIcon.className = 'warning-icon';
                warningIcon.textContent = '!';
                
                selectedProduct.appendChild(warningIcon);
            }

            // Переключение состояния сборки (развернуть/свернуть)
            toggleButton.addEventListener('click', function() {
                if (buildContent.classList.contains('expanded')) {
                    // Сворачиваем
                    buildContent.classList.remove('expanded');
                    this.textContent = '+';
                    
                    // // Очищаем сборку
                    // document.querySelectorAll('.add-button').forEach(btn => btn.classList.remove('active'));
                    // document.querySelectorAll('.selected-product').forEach(product => {
                    //     product.style.display = 'none';
                    // });
                    // document.querySelectorAll('.empty-slot').forEach(slot => {
                    //     slot.style.display = 'flex';
                    // });
                    
                    // // Сбрасываем цену
                    // totalPrice = 0;
                    // totalPriceElement.textContent = '0';
                    
                    // // Сбрасываем проверку совместимости
                    // compatibilityCheck.className = 'compatibility-check empty';
                    // compatibilityCheck.textContent = '';
                } else {
                    // Разворачиваем
                    buildContent.classList.add('expanded');
                    this.textContent = '-';
                }
            });

            componentButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Убираем активный класс у всех кнопок
                    componentButtons.forEach(btn => btn.classList.remove('active'));
                    // Добавляем активный класс текущей кнопке
                    this.classList.add('active');

                    // Скрываем все подфильтры
                    subfilters.forEach(filter => filter.classList.remove('active'));
                    // Скрываем пустое состояние
                    emptyFilters.style.display = 'none';
                    // Скрываем инструкцию
                    instructions.style.display = 'none';

                    // Показываем нужный подфильтр
                    const component = this.getAttribute('data-component');
                    document.getElementById(`${component}-filters`).classList.add('active');

                    // Скрываем все секции с товарами
                    productSections.forEach(section => section.style.display = 'none');
                    // Показываем нужную секцию
                    document.getElementById(`${component}-products`).style.display = 'block';
                    
                    // Применяем строгий фильтр при переключении компонентов
                    if (document.getElementById('strict-filter-toggle').checked) {
                        applyStrictFilter();
                    }
                    
                    // Проверяем совместимость
                    checkCompatibility();
                });
            });

            // По умолчанию показываем инструкцию и пустое состояние
            emptyFilters.style.display = 'block';
            instructions.style.display = 'block';
            productSections.forEach(section => section.style.display = 'none');

            // Управление фильтрами опций
            const optionButtons = document.querySelectorAll('.option-button');
            optionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Если включен строгий фильтр и это фильтр подключения питания - не позволяем снимать выбор
                    if (document.getElementById('strict-filter-toggle').checked && 
                        this.closest('#psu-filters') && 
                        this.hasAttribute('data-connector')) {
                        return;
                    }
                    
                    this.classList.toggle('active');
                    filterProducts();
                    
                    // Проверяем совместимость
                    checkCompatibility();
                });
            });

            // Добавление/удаление товаров в сборку
            const addButtons = document.querySelectorAll('.add-button');
            addButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productCard = this.closest('.product-card');
                    const productName = productCard.querySelector('.product-name').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;

                    // Определяем тип компонента
                    let componentType;
                    if (productCard.closest('#gpu-products')) {
                        componentType = 'gpu';
                    } else if (productCard.closest('#cpu-products')) {
                        componentType = 'cpu';
                    } else if (productCard.closest('#mb-products')) {
                        componentType = 'mb';
                    } else if (productCard.closest('#psu-products')) {
                        componentType = 'psu';
                    }
                    
                     if (!buildContent.classList.contains('expanded')) {
                    // Если окно сборки закрыто - открываем его
                    buildContent.classList.add('expanded');
                    toggleButton.textContent = '-';
                    }
                    
                    // Если кнопка уже активна (товар уже выбран) - удаляем из сборки
                    if (this.classList.contains('active')) {
                        this.classList.remove('active');
                        
                        // Удаляем товар из слота
                        const slot = document.getElementById(`${componentType}-slot`);
                        slot.querySelector('.selected-product').style.display = 'none';
                        slot.querySelector('.empty-slot').style.display = 'flex';
                        
                        // Обновляем общую цену (вычитаем цену удаленного товара)
                        const priceText = productPrice.replace(/[^\d]/g, '');
                        const price = parseInt(priceText) || 0;
                        totalPrice = Math.max(0, totalPrice - price);
                        totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU');
                        
                        // Проверяем совместимость
                        checkCompatibility();
                        return;
                    }
                    
                    // Удаляем активный класс у всех кнопок этого типа компонента
                    document.querySelectorAll(`#${componentType}-products .add-button`).forEach(btn => {
                        // Вычитаем цену предыдущего выбранного компонента, если он был
                        if (btn.classList.contains('active')) {
                            const prevProductCard = btn.closest('.product-card');
                            const prevPriceText = prevProductCard.querySelector('.product-price').textContent.replace(/[^\d]/g, '');
                            const prevPrice = parseInt(prevPriceText) || 0;
                            totalPrice = Math.max(0, totalPrice - prevPrice);
                        }
                        btn.classList.remove('active');
                    });
                    
                    // Добавляем активный класс текущей кнопке
                    this.classList.add('active');
                    
                    // Обновляем слот в сборке
                    const slot = document.getElementById(`${componentType}-slot`);
                    const selectedProduct = slot.querySelector('.selected-product');
                    
                    selectedProduct.querySelector('.product-name').textContent = productName;
                    selectedProduct.querySelector('.product-price').textContent = productPrice;
                    
                    selectedProduct.style.display = 'block';
                    slot.querySelector('.empty-slot').style.display = 'none';
                    
                    // Добавляем обработчик для кнопки удаления в слоте
                    const removeButton = selectedProduct.querySelector('.remove-button');
                    removeButton.onclick = function() {
                        // Удаляем товар из сборки
                        selectedProduct.style.display = 'none';
                        slot.querySelector('.empty-slot').style.display = 'flex';
                        button.classList.remove('active');

                        if (!buildContent.classList.contains('expanded')) {
                        // Если окно сборки закрыто - открываем его
                        buildContent.classList.add('expanded');
                        toggleButton.textContent = '-';
                        }
                        
                        // Обновляем общую цену (вычитаем цену удаленного товара)
                        const priceText = productPrice.replace(/[^\d]/g, '');
                        const price = parseInt(priceText) || 0;
                        totalPrice = Math.max(0, totalPrice - price);
                        totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU');
                        
                        // Проверяем совместимость
                        checkCompatibility();
                    };
                    
                    // Обновляем общую цену (добавляем цену нового товара)
                    const priceText = productPrice.replace(/[^\d]/g, '');
                    const price = parseInt(priceText) || 0;
                    totalPrice += price;
                    totalPriceElement.textContent = totalPrice.toLocaleString('ru-RU');
                    
                    // Применяем строгий фильтр если он включен
                    if (document.getElementById('strict-filter-toggle').checked) {
                        applyStrictFilter();
                    }
                    
                    // Проверяем совместимость
                    checkCompatibility();
                });
            });

            // Переключатель строгого фильтра
            document.getElementById('strict-filter-toggle').addEventListener('change', function() {
                if (this.checked) {
                    applyStrictFilter();
                } else {
                    // Сбрасываем все фильтры при выключении строгого фильтра
                    optionButtons.forEach(btn => {
                        // Не сбрасываем фильтры подключения питания, если строгий фильтр включен
                        if (!(document.getElementById('strict-filter-toggle').checked && 
                              btn.closest('#psu-filters') && 
                              btn.hasAttribute('data-connector'))) {
                            btn.classList.remove('active');
                        }
                    });
                    filterProducts();
                }
                
                // Проверяем совместимость
                checkCompatibility();
            });

            // Обработчик кнопки удаления всех компонентов
            document.getElementById('delete-all-btn').addEventListener('click', function() {
                // Удаляем все выбранные компоненты
                document.querySelectorAll('.add-button.active').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Скрываем все выбранные продукты и показываем пустые слоты
                document.querySelectorAll('.selected-product').forEach(product => {
                    product.style.display = 'none';
                });
                
                document.querySelectorAll('.empty-slot').forEach(slot => {
                    slot.style.display = 'flex';
                });
                
                // Сбрасываем общую цену
                totalPrice = 0;
                document.getElementById('total-price').textContent = '0';
                
                // Сбрасываем проверку совместимости
                document.getElementById('compatibility-check').className = 'compatibility-check empty';
                document.getElementById('compatibility-check').textContent = '';
                
                // Сбрасываем все фильтры
                document.querySelectorAll('.option-button.active').forEach(btn => {
                    btn.classList.remove('active');
                });
                filterProducts();
            });

            function filterProducts() {
                // Получаем активный компонент
                const activeComponent = document.querySelector('.filter-button.active').getAttribute('data-component');
                const productCards = document.querySelectorAll(`#${activeComponent}-products .product-card`);

                productCards.forEach(card => {
                    let shouldShow = true;

                    // Проверяем фильтры для видеокарт
                    if (activeComponent === 'gpu') {
                        const activeTypes = Array.from(document.querySelectorAll('#gpu-filters .option-button[data-type].active'))
                            .map(btn => btn.getAttribute('data-type'));
                        const activeBrands = Array.from(document.querySelectorAll('#gpu-filters .option-button[data-brand].active'))
                            .map(btn => btn.getAttribute('data-brand'));

                        if (activeTypes.length > 0 && !activeTypes.includes(card.getAttribute('data-type'))) {
                            shouldShow = false;
                        }
                        if (activeBrands.length > 0 && !activeBrands.includes(card.getAttribute('data-brand'))) {
                            shouldShow = false;
                        }
                    }

                    // Проверяем фильтры для процессоров
                    if (activeComponent === 'cpu') {
                        const activeSockets = Array.from(document.querySelectorAll('#cpu-filters .option-button[data-socket].active'))
                            .map(btn => btn.getAttribute('data-socket'));

                        if (activeSockets.length > 0 && !activeSockets.includes(card.getAttribute('data-socket'))) {
                            shouldShow = false;
                        }
                    }

                    // Проверяем фильтры для материнских плат
                    if (activeComponent === 'mb') {
                        const activeSockets = Array.from(document.querySelectorAll('#mb-filters .option-button[data-socket].active'))
                            .map(btn => btn.getAttribute('data-socket'));
                        const activeCpuPowers = Array.from(document.querySelectorAll('#mb-filters .option-button[data-cpu-power].active'))
                            .map(btn => btn.getAttribute('data-cpu-power'));
                        const activeMbBrands = Array.from(document.querySelectorAll('#mb-filters .option-button[data-mb-brand].active'))
                            .map(btn => btn.getAttribute('data-mb-brand'));

                        if (activeSockets.length > 0 && !activeSockets.includes(card.getAttribute('data-socket'))) {
                            shouldShow = false;
                        }
                        if (activeCpuPowers.length > 0 && !activeCpuPowers.includes(card.getAttribute('data-cpu-power'))) {
                            shouldShow = false;
                        }
                        if (activeMbBrands.length > 0 && !activeMbBrands.includes(card.getAttribute('data-mb-brand'))) {
                            shouldShow = false;
                        }
                    }

                    // Проверяем фильтры для блоков питания
                    if (activeComponent === 'psu') {
                        const activeConnectors = Array.from(document.querySelectorAll('#psu-filters .option-button[data-connector].active'))
                            .map(btn => btn.getAttribute('data-connector'));
                        const activeWattages = Array.from(document.querySelectorAll('#psu-filters .option-button[data-wattage].active'))
                            .map(btn => btn.getAttribute('data-wattage'));
                        const activeCpuConnectors = Array.from(document.querySelectorAll('#psu-filters .option-button[data-cpu-connector].active'))
                            .map(btn => btn.getAttribute('data-cpu-connector'));
                        const activePsuBrands = Array.from(document.querySelectorAll('#psu-filters .option-button[data-psu-brand].active'))
                            .map(btn => btn.getAttribute('data-psu-brand'));

                        if (activeConnectors.length > 0 && !activeConnectors.includes(card.getAttribute('data-connector'))) {
                            shouldShow = false;
                        }
                        if (activeWattages.length > 0 && !activeWattages.includes(card.getAttribute('data-wattage'))) {
                            shouldShow = false;
                        }
                        if (activeCpuConnectors.length > 0 && !activeCpuConnectors.includes(card.getAttribute('data-cpu-connector'))) {
                            shouldShow = false;
                        }
                        if (activePsuBrands.length > 0 && !activePsuBrands.includes(card.getAttribute('data-psu-brand'))) {
                            shouldShow = false;
                        }
                    }

                    card.style.display = shouldShow ? 'block' : 'none';
                });
            }

            // Добавляем обработчик для кнопки "Наверх"
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                backToTop.addEventListener('click', () => {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                });
                
                // Показываем/скрываем кнопку при прокрутке
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTop.style.display = 'flex';
                    } else {
                        backToTop.style.display = 'none';
                    }
                });

            function applyStrictFilter() {
                // Получаем выбранные компоненты
                const gpuSlot = document.getElementById('gpu-slot');
                const cpuSlot = document.getElementById('cpu-slot');
                const mbSlot = document.getElementById('mb-slot');
                const psuSlot = document.getElementById('psu-slot');
                
                // Применяем фильтры в зависимости от текущей вкладки
                const activeComponent = document.querySelector('.filter-button.active').getAttribute('data-component');
                
                if (activeComponent === 'psu') {
                    // Если активна вкладка БП, фильтруем по выбранной видеокарте
                    if (gpuSlot.querySelector('.selected-product').style.display !== 'none') {
                        const gpuCard = document.querySelector('#gpu-products .add-button.active').closest('.product-card');
                        const gpuType = gpuCard.getAttribute('data-type');
                        
                        // Активируем соответствующий фильтр подключения
                        const connectorButton = document.querySelector(`#psu-filters .option-button[data-connector="${gpuType}"]`);
                        if (connectorButton) {
                            // Сначала снимаем все фильтры подключения
                            document.querySelectorAll('#psu-filters .option-button[data-connector]').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            // Затем активируем нужный
                            connectorButton.classList.add('active');
                        }
                    }
                    
                    // Также учитываем выбранную материнскую плату для подбора БП
                    if (mbSlot.querySelector('.selected-product').style.display !== 'none') {
                        const mbCard = document.querySelector('#mb-products .add-button.active').closest('.product-card');
                        const cpuPower = mbCard.getAttribute('data-cpu-power');
                        
                        // Активируем соответствующий фильтр подключения процессора
                        const cpuConnectorButton = document.querySelector(`#psu-filters .option-button[data-cpu-connector="${cpuPower}"]`);
                        if (cpuConnectorButton) {
                            // Сначала снимаем все фильтры подключения процессора
                            document.querySelectorAll('#psu-filters .option-button[data-cpu-connector]').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            // Затем активируем нужный
                            cpuConnectorButton.classList.add('active');
                        }
                        
                        // Активируем соответствующий фильтр питания процессора на материнских платах
                        if (cpuPower) {
                            const mbCpuPowerButton = document.querySelector(`#mb-filters .option-button[data-cpu-power="${cpuPower}"]`);
                            if (mbCpuPowerButton) {
                                document.querySelectorAll('#mb-filters .option-button[data-cpu-power]').forEach(btn => {
                                    btn.classList.remove('active');
                                });
                                mbCpuPowerButton.classList.add('active');
                            }
                        }
                    }
                }
                else if (activeComponent === 'mb') {
                    // Если активна вкладка материнских плат, учитываем выбранный процессор
                    if (cpuSlot.querySelector('.selected-product').style.display !== 'none') {
                        const cpuCard = document.querySelector('#cpu-products .add-button.active').closest('.product-card');
                        const cpuSocket = cpuCard.getAttribute('data-socket');
                        
                        // Активируем соответствующий фильтр сокета
                        const socketButton = document.querySelector(`#mb-filters .option-button[data-socket="${cpuSocket}"]`);
                        if (socketButton) {
                            // Сначала снимаем все фильтры сокета
                            document.querySelectorAll('#mb-filters .option-button[data-socket]').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            // Затем активируем нужный
                            socketButton.classList.add('active');
                        }
                    }
                    
                    // Учитываем выбранный блок питания для подбора материнской платы
                    if (psuSlot.querySelector('.selected-product').style.display !== 'none') {
                        const psuCard = document.querySelector('#psu-products .add-button.active').closest('.product-card');
                        const psuCpuConnector = psuCard.getAttribute('data-cpu-connector');
                        
                        // Активируем соответствующий фильтр питания процессора
                        if (psuCpuConnector) {
                            const mbCpuPowerButton = document.querySelector(`#mb-filters .option-button[data-cpu-power="${psuCpuConnector}"]`);
                            if (mbCpuPowerButton) {
                                document.querySelectorAll('#mb-filters .option-button[data-cpu-power]').forEach(btn => {
                                    btn.classList.remove('active');
                                });
                                mbCpuPowerButton.classList.add('active');
                            }
                        }
                    }
                }
                
                // Применяем фильтры
                filterProducts();
                
                // Проверяем совместимость
                checkCompatibility();
            }
            }
        });