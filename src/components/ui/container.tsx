'use client';

import {
	color,
	space,
	layout,
	flexbox,
	position,
	ColorProps,
	SpaceProps,
	LayoutProps,
	FlexboxProps,
	PositionProps,
} from 'styled-system';
import styled from 'styled-components';
import { layoutConstant } from '../../constants/index';
import { isValidProp } from '../../utils/utils';

const Container = styled.div.withConfig({
	shouldForwardProp: (prop: string) => isValidProp(prop),
})<LayoutProps & ColorProps & PositionProps & SpaceProps & FlexboxProps>`
	margin-left: auto;
	margin-right: auto;
	max-width: ${({ maxWidth }) =>
		maxWidth || layoutConstant.containerWidth}; /* make maxWidth dynamic */

	${color}
	${position}
  	${flexbox}
  	${layout}
  	${space}
`;

export default Container;
