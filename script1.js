    let selectedTextElement = null;
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let textCounter = 1;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            selectedTextElement = document.getElementById('textOverlay1');
            updateControls();
            setupEventListeners();
        });

        function setupEventListeners() {
            const controls = {
                textContent: document.getElementById('textContent'),
                fontSize: document.getElementById('fontSize'),
                fontWeight: document.getElementById('fontWeight'),
                textColor: document.getElementById('textColor'),
                fontFamily: document.getElementById('fontFamily')
            };

            // Text content change
            controls.textContent.addEventListener('input', function() {
                if (selectedTextElement) {
                    selectedTextElement.querySelector('.text-content').textContent = this.value;
                }
            });

            // Font size change
            controls.fontSize.addEventListener('input', function() {
                document.getElementById('fontSizeValue').textContent = this.value + 'px';
                if (selectedTextElement) {
                    selectedTextElement.querySelector('.text-content').style.fontSize = this.value + 'px';
                }
            });

            // Font weight change
            controls.fontWeight.addEventListener('change', function() {
                if (selectedTextElement) {
                    selectedTextElement.querySelector('.text-content').style.fontWeight = this.value;
                }
            });

            // Text color change
            controls.textColor.addEventListener('change', function() {
                if (selectedTextElement) {
                    selectedTextElement.querySelector('.text-content').style.color = this.value;
                }
            });

            // Font family change
            controls.fontFamily.addEventListener('change', function() {
                if (selectedTextElement) {
                    selectedTextElement.querySelector('.text-content').style.fontFamily = this.value;
                }
            });

            // Setup drag and drop for existing text
            setupTextDragDrop();
        }

        function setupTextDragDrop() {
            const textOverlays = document.querySelectorAll('.text-overlay');
            
            textOverlays.forEach(overlay => {
                // Click to select
                overlay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectTextElement(this);
                });

                // Mouse down - start drag
                overlay.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    selectTextElement(this);
                    startDrag(e, this);
                });

                // Touch start - start drag (mobile)
                overlay.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    selectTextElement(this);
                    const touch = e.touches[0];
                    startDrag(touch, this);
                });
            });

            // Mouse move - drag
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('touchmove', function(e) {
                const touch = e.touches[0];
                handleDrag(touch);
            });

            // Mouse up - stop drag
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);

            // Click on image container to deselect
            document.querySelector('.image-container').addEventListener('click', function(e) {
                if (e.target === this || e.target.classList.contains('main-image')) {
                    deselectAll();
                }
            });
        }

        function startDrag(event, element) {
            isDragging = true;
            const rect = element.getBoundingClientRect();
            const containerRect = element.parentElement.getBoundingClientRect();
            
            dragOffset.x = event.clientX - rect.left;
            dragOffset.y = event.clientY - rect.top;
            
            element.style.cursor = 'grabbing';
        }

        function handleDrag(event) {
            if (!isDragging || !selectedTextElement) return;
            
            const container = selectedTextElement.parentElement;
            const containerRect = container.getBoundingClientRect();
            
            const x = event.clientX - containerRect.left - dragOffset.x;
            const y = event.clientY - containerRect.top - dragOffset.y;
            
            // Constrain within container bounds
            const maxX = container.offsetWidth - selectedTextElement.offsetWidth;
            const maxY = container.offsetHeight - selectedTextElement.offsetHeight;
            
            const constrainedX = Math.max(0, Math.min(x, maxX));
            const constrainedY = Math.max(0, Math.min(y, maxY));
            
            selectedTextElement.style.left = constrainedX + 'px';
            selectedTextElement.style.top = constrainedY + 'px';
        }

        function stopDrag() {
            if (isDragging && selectedTextElement) {
                selectedTextElement.style.cursor = 'move';
            }
            isDragging = false;
        }

        function selectTextElement(element) {
            // Remove selected class from all elements
            document.querySelectorAll('.text-overlay').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selected class to clicked element
            element.classList.add('selected');
            selectedTextElement = element;
            
            updateControls();
        }

        function deselectAll() {
            document.querySelectorAll('.text-overlay').forEach(el => {
                el.classList.remove('selected');
            });
            selectedTextElement = null;
        }

        function updateControls() {
            if (!selectedTextElement) return;
            
            const textContent = selectedTextElement.querySelector('.text-content');
            const styles = window.getComputedStyle(textContent);
            
            document.getElementById('textContent').value = textContent.textContent;
            document.getElementById('fontSize').value = parseInt(styles.fontSize);
            document.getElementById('fontSizeValue').textContent = parseInt(styles.fontSize) + 'px';
            document.getElementById('fontWeight').value = styles.fontWeight === '700' ? 'bold' : styles.fontWeight;
            document.getElementById('textColor').value = rgbToHex(styles.color);
            document.getElementById('fontFamily').value = styles.fontFamily;
        }

        function addNewText() {
            textCounter++;
            const container = document.querySelector('.image-container');
            
            const newTextOverlay = document.createElement('div');
            newTextOverlay.className = 'text-overlay';
            newTextOverlay.id = 'textOverlay' + textCounter;
            newTextOverlay.style.top = '100px';
            newTextOverlay.style.left = '100px';
            
            const textContent = document.createElement('div');
            textContent.className = 'text-content';
            textContent.textContent = 'New Text';
            
            newTextOverlay.appendChild(textContent);
            container.appendChild(newTextOverlay);
            
            // Setup drag and drop for new element
            setupTextDragDrop();
            
            // Select the new text element
            selectTextElement(newTextOverlay);
        }

        function deleteSelectedText() {
            if (selectedTextElement) {
                selectedTextElement.remove();
                selectedTextElement = null;
            }
        }

        // Helper function to convert RGB to HEX
        function rgbToHex(rgb) {
            if (rgb.startsWith('#')) return rgb;
            
            const result = rgb.match(/\d+/g);
            if (!result || result.length < 3) return '#ffffff';
            
            return '#' + result.slice(0, 3).map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

  const slides = document.querySelector('.slides');
  const slideCount = document.querySelectorAll('.slide').length;
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dotsContainer = document.querySelector('.dots');
  let currentIndex = 0;

  // create dots
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll('.dots span');

  function updateSlider() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlider();
  });
